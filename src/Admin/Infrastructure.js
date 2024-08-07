import React, { useState, useEffect } from 'react';
import { ref, set, push, get, update, remove } from 'firebase/database';
import { db } from '../firebaseConfig'; // Adjust the path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons';

function Infrastructure() {
  const [blocks, setBlocks] = useState([]);
  const [blockName, setBlockName] = useState('');
  const [blockImage, setBlockImage] = useState(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [hallName, setHallName] = useState('');
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');
  const [noOfSeats, setNoOfSeats] = useState('');
  const [seatingArrangement, setSeatingArrangement] = useState([]);
  const [showAddHall, setShowAddHall] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [editHall, setEditHall] = useState(null);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    const blocksRef = ref(db, 'infrastructure');
    const snapshot = await get(blocksRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const blocksArray = Object.entries(data).map(([key, value]) => ({
        key,
        ...value
      }));
      setBlocks(blocksArray);
    }
  };

  const handleAddBlock = () => {
    setShowAddBlock(true);
  };

  const handleSaveBlock = async () => {
    // Check if block name is unique
    const existingBlock = blocks.find(block => block.name === blockName);
    if (existingBlock) {
      alert('Block name already exists. Please choose a different name.');
      return;
    }

    const blockRef = push(ref(db, 'infrastructure'));
    const blockData = {
      name: blockName,
      image: blockImage ? URL.createObjectURL(blockImage) : ''
    };

    await set(blockRef, blockData)
      .then(() => {
        alert('Block added successfully!');
        setShowAddBlock(false);
        setBlockName('');
        setBlockImage(null);
        fetchBlocks();
      })
      .catch(error => console.error('Error adding block:', error));
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setShowAddHall(false);
  };

  const handleAddHall = () => {
    setShowAddHall(true);
  };

  const handlePreviewSeating = () => {
    let seats = [];
    for (let i = 0; i < rows; i++) {
      let rowSeats = [];
      for (let j = 0; j < cols; j++) {
        let seatNumber = i * cols + j + 1;
        if (noOfSeats && seatNumber > noOfSeats) continue;
        rowSeats.push(seatNumber);
      }
      seats.push(rowSeats);
    }
    setSeatingArrangement(seats);
  };

  const handleSaveHall = async () => {
    const hallRef = ref(db, `infrastructure/${selectedBlock.key}/halls/${hallName}`);
    const hallData = {
      name: hallName,
      rows,
      cols,
      noOfSeats,
      seatingArrangement
    };

    await set(hallRef, hallData)
      .then(() => {
        alert('Hall added successfully!');
        setShowAddHall(false);
        setHallName('');
        setRows('');
        setCols('');
        setNoOfSeats('');
        setSeatingArrangement([]);
        fetchBlocks();
      })
      .catch(error => console.error('Error adding hall:', error));
  };

  const handleEditBlock = (block) => {
    setEditBlock(block);
    setBlockName(block.name);
    setBlockImage(null);
  };

  const handleUpdateBlock = async () => {
    const blockRef = ref(db, `infrastructure/${editBlock.key}`);
    const blockData = {
      name: blockName,
      image: blockImage ? URL.createObjectURL(blockImage) : editBlock.image
    };

    await update(blockRef, blockData)
      .then(() => {
        alert('Block updated successfully!');
        setEditBlock(null);
        setBlockName('');
        setBlockImage(null);
        fetchBlocks();
      })
      .catch(error => console.error('Error updating block:', error));
  };

  const handleDeleteBlock = async (blockKey) => {
    const blockRef = ref(db, `infrastructure/${blockKey}`);
    await remove(blockRef)
      .then(() => {
        alert('Block deleted successfully!');
        fetchBlocks();
      })
      .catch(error => console.error('Error deleting block:', error));
  };

  const handleEditHall = (hall) => {
    setEditHall(hall);
    setHallName(hall.name);
    setRows(hall.rows);
    setCols(hall.cols);
    setNoOfSeats(hall.noOfSeats);
    setSeatingArrangement(hall.seatingArrangement);
  };

  const handleUpdateHall = async () => {
    const hallRef = ref(db, `infrastructure/${selectedBlock.key}/halls/${editHall.name}`);
    const hallData = {
      name: hallName,
      rows,
      cols,
      noOfSeats,
      seatingArrangement
    };

    await update(hallRef, hallData)
      .then(() => {
        alert('Hall updated successfully!');
        setEditHall(null);
        setHallName('');
        setRows('');
        setCols('');
        setNoOfSeats('');
        setSeatingArrangement([]);
        fetchBlocks();
      })
      .catch(error => console.error('Error updating hall:', error));
  };

  const handleDeleteHall = async (blockKey, hallName) => {
    const hallRef = ref(db, `infrastructure/${blockKey}/halls/${hallName}`);
    await remove(hallRef)
      .then(() => {
        alert('Hall deleted successfully!');
        fetchBlocks();
      })
      .catch(error => console.error('Error deleting hall:', error));
  };

  const handleSeatClick = (seatNumber) => {
    const edit = window.confirm(`Do you want to edit seat ${seatNumber}?`);
    if (edit) {
      const newSeatNumber = prompt(`Enter new seat number for seat ${seatNumber}:`, seatNumber);
      // Implement the seat update logic here
    } else {
      const remove = window.confirm(`Do you want to delete seat ${seatNumber}?`);
      if (remove) {
        // Implement the seat delete logic here
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Infrastructure Management</h1>
      <div className="row">
        <div className="col-md-4">
          {showAddBlock || editBlock ? (
            <div className="card p-3 mb-4">
              <h2>{editBlock ? 'Edit Block' : 'Add Block'}</h2>
              <div className="mb-3">
                <label className="form-label">Block Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={blockName} 
                  onChange={(e) => setBlockName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Block Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => setBlockImage(e.target.files[0])} 
                />
              </div>
              <button className="btn btn-primary" onClick={editBlock ? handleUpdateBlock : handleSaveBlock}>
                {editBlock ? 'Update Block' : 'Save Block'}
              </button>
              {editBlock && (
                <button className="btn btn-danger ms-2" onClick={() => setEditBlock(null)}>Cancel</button>
              )}
            </div>
          ) : (
            <div className="card p-3 mb-4">
              <h2>Blocks</h2>
              <button className="btn btn-success mb-3" onClick={handleAddBlock}>+ Add Block</button>
              {blocks.map(block => (
                <div key={block.key} className="card p-3 mb-3 d-flex align-items-center">
                  <div className="d-flex align-items-center w-100">
                    <div className="circle me-3">
                      <img src={block.image} alt={block.name} className="img-fluid rounded-circle" />
                    </div>
                    <div className="flex-grow-1">
                      <h4 onClick={() => handleBlockClick(block)}>{block.name}</h4>
                      {block.halls && (
                        <div>
                          <h5>Halls:</h5>
                          {Object.keys(block.halls).map(hallKey => (
                            <div key={hallKey} className="d-flex align-items-center justify-content-between">
                              <span>{block.halls[hallKey].name}</span>
                              <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEditHall(block.halls[hallKey])}>Edit</button>
                              <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteHall(block.key, hallKey)}>Delete</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="btn btn-warning ms-3" onClick={() => handleEditBlock(block)}>Edit Block</button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDeleteBlock(block.key)}>Delete Block</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-8">
          {selectedBlock && !showAddHall && (
            <div className="card p-3 mb-4">
              <h2>Block: {selectedBlock.name}</h2>
              <button className="btn btn-success mb-3" onClick={handleAddHall}>+ Add Hall</button>
              {Object.keys(selectedBlock.halls || {}).map(hallKey => (
                <div key={hallKey} className="card p-3 mb-3">
                  <h4>{selectedBlock.halls[hallKey].name}</h4>
                  {/* Additional hall details and actions can go here */}
                </div>
              ))}
            </div>
          )}
          {showAddHall && (
            <div className="card p-3 mb-4">
              <h2>{editHall ? 'Edit Hall' : 'Add Hall'}</h2>
              <div className="mb-3">
                <label className="form-label">Hall Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={hallName} 
                  onChange={(e) => setHallName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rows</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={rows} 
                  onChange={(e) => setRows(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Columns</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={cols} 
                  onChange={(e) => setCols(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of Seats (Optional)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={noOfSeats} 
                  onChange={(e) => setNoOfSeats(e.target.value)} 
                />
              </div>
              <button className="btn btn-primary mb-3" onClick={handlePreviewSeating}>Preview Seating</button>
              <div className="seating-arrangement">
              <center><div className="board" >Board</div></center>
              <center><div className="dias">Dias</div></center>
                {seatingArrangement.map((row, rowIndex) => (
                  <div key={rowIndex} className="d-flex justify-content-center mb-2">
                    {row.map(seat => (
                      <div 
                        key={seat} 
                        className="seat-icon" 
                        onClick={() => handleSeatClick(seat)}
                        style={{
                          width: '30px',
                          height: '30px',
                          margin: '2px',
                          backgroundColor: '#007bff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {seat}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={editHall ? handleUpdateHall : handleSaveHall}>
                {editHall ? 'Update Hall' : 'Save Hall'}
              </button>
              {editHall && (
                <button className="btn btn-danger ms-2" onClick={() => setEditHall(null)}>Cancel</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Infrastructure;
