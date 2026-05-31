
import React, { useState } from 'react';
import { Note } from '../../types';
import { supabase } from '../../supabase';

interface NotesProps {
  notes: Note[];
  setNotes: (val: Note[]) => void;
  profile: any;
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes, profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note> | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const tags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const handleSave = async () => {
    if (!currentNote?.title || !profile) return;
    setIsSaving(true);

    const noteToSave = {
      user_id: profile.id,
      title: currentNote.title || 'Untitled',
      content: currentNote.content || '',
      tags: currentNote.tags || [],
      pinned: currentNote.pinned || false,
      created_at: currentNote.created_at || new Date().toISOString(),
    };

    let result;
    if (currentNote.id) {
      result = await supabase
        .from('notes')
        .update(noteToSave)
        .eq('id', currentNote.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('notes')
        .insert([noteToSave])
        .select()
        .single();
    }

    if (!result.error && result.data) {
      const savedNote = result.data as Note;
      if (currentNote.id) {
        setNotes(notes.map(n => n.id === currentNote.id ? savedNote : n));
      } else {
        setNotes([savedNote, ...notes]);
      }
      setViewingNote(savedNote);
      setIsEditing(false);
      setCurrentNote(null);
    } else {
      console.error("Error saving note:", result.error);
      alert("Failed to save note to server.");
    }
    setIsSaving(false);
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotes(notes.filter(n => n.id !== id));
      setViewingNote(null);
    } else {
      console.error("Error deleting note:", error);
      alert("Failed to delete note from server.");
    }
  };

  const togglePin = async (note: Note) => {
    const updated = { ...note, pinned: !note.pinned };
    const { error } = await supabase
      .from('notes')
      .update({ pinned: updated.pinned })
      .eq('id', note.id);

    if (!error) {
      setNotes(notes.map(n => n.id === note.id ? updated : n));
      if (viewingNote?.id === note.id) setViewingNote(updated);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-300">
        <header className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-rose-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="font-bold text-slate-100 uppercase tracking-widest text-sm">Edit Note</h3>
          <button onClick={handleSave} disabled={isSaving} className={`${isSaving ? 'opacity-50' : 'text-emerald-500 hover:text-emerald-400'} transition-colors`}>
            {isSaving ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined">check</span>}
          </button>
        </header>
        <div className="p-10 space-y-6">
          <input 
            className="w-full text-4xl font-black bg-transparent border-none focus:outline-none placeholder-slate-700 text-white"
            placeholder="Title"
            value={currentNote?.title || ''}
            onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
          />
          <div className="flex flex-wrap gap-2 items-center">
            <span className="material-symbols-outlined text-slate-600">label</span>
            <input 
              className="flex-1 bg-transparent border-none focus:outline-none placeholder-slate-700 text-slate-400 text-sm font-bold uppercase tracking-widest"
              placeholder="Add tags (comma separated)..."
              value={currentNote?.tags?.join(', ') || ''}
              onChange={e => setCurrentNote({ ...currentNote, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
            />
          </div>
          <div className="flex space-x-6 border-y border-slate-800 py-4 text-slate-500">
            <span className="material-symbols-outlined cursor-pointer hover:text-brand-400">format_bold</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-brand-400">format_italic</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-indigo-400">format_list_bulleted</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-indigo-400">code</span>
          </div>
          <textarea 
            className="w-full h-96 bg-transparent border-none focus:outline-none text-slate-300 text-lg leading-relaxed placeholder-slate-800 resize-none"
            placeholder="Content..."
            value={currentNote?.content || ''}
            onChange={e => setCurrentNote({ ...currentNote, content: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (viewingNote) {
    return (
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in slide-in-from-right duration-300">
        <header className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <button onClick={() => setViewingNote(null)} className="text-slate-500 hover:text-indigo-400 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button onClick={() => togglePin(viewingNote)} className={viewingNote.pinned ? 'text-amber-500' : 'text-slate-600'}>
            <span className="material-symbols-outlined">push_pin</span>
          </button>
        </header>
        <div className="p-12">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight">{viewingNote.title}</h1>
          <div className="flex gap-3 mb-12">
            {viewingNote.tags.map(t => <span key={t} className="px-3 py-1 bg-slate-800 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-700">#{t}</span>)}
          </div>
          <div className="text-xl text-slate-300 whitespace-pre-wrap leading-relaxed">
            {viewingNote.content}
          </div>
        </div>
        <div className="fixed bottom-12 right-12 flex flex-col space-y-6">
          <button 
            onClick={() => { setIsEditing(true); setCurrentNote(viewingNote); setViewingNote(null); }}
            className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button 
            onClick={() => deleteNote(viewingNote.id)}
            className="w-16 h-16 bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center space-x-4 overflow-x-auto pb-6 scrollbar-hide">
        <button 
          onClick={() => setFilterTag(null)}
          className={`px-8 py-3 rounded-2xl whitespace-nowrap font-black uppercase tracking-widest text-[10px] transition-all ${!filterTag ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
        >
          All
        </button>
        {tags.map(tag => (
          <button 
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-8 py-3 rounded-2xl whitespace-nowrap font-black uppercase tracking-widest text-[10px] transition-all ${filterTag === tag ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {notes.filter(n => n.pinned).length > 0 && (
          <div className="space-y-6">
            <h4 className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px] flex items-center px-4">
              <span className="material-symbols-outlined text-sm mr-2 text-amber-500">push_pin</span>
              Pinned Notes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.filter(n => n.pinned).map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setViewingNote(note)} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
           <h4 className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px] px-4">Recents</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.filter(n => !n.pinned && (!filterTag || n.tags.includes(filterTag))).map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setViewingNote(note)} />
              ))}
              {notes.filter(n => !n.pinned && (!filterTag || n.tags.includes(filterTag))).length === 0 && (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-700">
                  <span className="material-symbols-outlined text-5xl block mb-4">edit_note</span>
                  <p className="font-bold uppercase tracking-widest text-xs">No notes found</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <button 
        onClick={() => { setIsEditing(true); setCurrentNote({ tags: [], pinned: false }); }}
        className="fixed bottom-12 right-12 w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30 group"
      >
        <span className="material-symbols-outlined text-4xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  );
};

const NoteCard: React.FC<{ note: Note, onClick: () => void }> = ({ note, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl hover:border-indigo-500/50 hover:shadow-indigo-900/10 transition-all cursor-pointer flex flex-col h-72 group"
  >
    <div className="flex justify-between items-start mb-6">
      <h3 className="font-black text-xl text-slate-100 line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-white transition-colors">{note.title}</h3>
      {note.pinned && <span className="material-symbols-outlined text-amber-500 text-sm">push_pin</span>}
    </div>
    <p className="text-slate-500 text-sm line-clamp-4 flex-1 leading-relaxed">{note.content}</p>
    <div className="mt-6 flex flex-wrap gap-2">
      {note.tags.slice(0, 3).map(tag => (
        <span key={tag} className="text-[9px] uppercase font-black text-indigo-500 tracking-widest bg-indigo-500/5 px-2 py-1 rounded-md">#{tag}</span>
      ))}
    </div>
  </div>
);

export default Notes;
