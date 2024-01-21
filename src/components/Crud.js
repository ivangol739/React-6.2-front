import React, { useState, useEffect } from 'react';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { red } from '@material-ui/core/colors';
import SendIcon from '@material-ui/icons/Send';
import { grey } from '@material-ui/core/colors';

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch('http://localhost:8080/notes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNotes(data);
      })
      .catch(error => {
        console.error('There was a problem fetching the notes:', error);
      });
  };

  const deleteNote = noteId => {
    fetch(`http://localhost:8080/notes/${noteId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchNotes();
      })
      .catch(error => {
        console.error('There was a problem deleting the note:', error);
      });
  };

  const addNote = () => {
    fetch('http://localhost:8080/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newNote })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchNotes();
        setNewNote('');
      })
      .catch(error => {
        console.error('There was a problem adding the note:', error);
      });
  };

  const refreshNotes = () => {
    fetchNotes();
  };

  const handleInputChange = (e) => {
    setNewNote(e.target.value);
  };

  return (
    <div className="container">
      <NoteForm
        newNote={newNote}
        onInputChange={handleInputChange}
        onAddNote={addNote}
        onRefreshNotes={refreshNotes}
      />
      <NotesList notes={notes} onDeleteNote={deleteNote} />
    </div>
  );
}

function NoteForm({ newNote, onInputChange, onAddNote, onRefreshNotes }) {
  return (
    <div className='notes-app'>
      <div className='header-update'>
        <h1 className='header-name'>Notes</h1>
        <div className='btn UpBtn' onClick={onRefreshNotes}>
          <AutorenewIcon style={{ color: green[500], fontSize: 20 }} />
        </div>
      </div>
      <label className='NewNote-label'>
        New note
      </label>
      <div className="input-container">
        <input 
          type="text"
          value={newNote}
          onChange={onInputChange}
          placeholder="Add a note"
        />
        <div className="btn AddBtn" onClick={onAddNote}>
          <SendIcon style={{ color: grey[900], fontSize: 20 }} />
        </div>
      </div>
    </div>
  );
}

function NotesList({ notes, onDeleteNote }) {
  return (
    <div className="notes-container">
      {notes.map(note => (
        <div key={note.id} className="note-card">
          <p>{note.content}</p>
          <div className="btn DelBtn" onClick={() => onDeleteNote(note.id)}>
            <CloseIcon style={{ color: red[500], fontSize: 20 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotesApp;