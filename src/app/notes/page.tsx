"use client";

import { useState, useRef, useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useFileStore } from "@/store/useFileStore";
import { 
  Plus, Search, FileText, Trash2, Star, Folder as FolderIcon, 
  ChevronRight, ChevronDown, MoreVertical, Upload, FileImage, 
  FileArchive, File, X, Link as LinkIcon, Hash, Clock
} from "lucide-react";
import { RichTextEditor } from "@/components/notes/RichTextEditor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgeVaultPage() {
  const { 
    notes, folders, activeNoteId, activeFolderId,
    addNote, updateNote, deleteNote, setActiveNote, toggleFavorite,
    addFolder, updateFolder, deleteFolder, setActiveFolder,
    addFileToNote, removeFileFromNote
  } = useNoteStore();
  
  const { saveFile, getFile, files } = useFileStore();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeNoteId) return;

    try {
      const fileId = await saveFile(file, activeNoteId);
      addFileToNote(activeNoteId, fileId);
    } catch (error) {
      alert("Failed to upload file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openFileViewer = async (fileId: string, fileName: string) => {
    const blob = await getFile(fileId);
    if (!blob) return alert("File not found.");
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-400" />;
    if (type.includes("image")) return <FileImage className="h-4 w-4 text-blue-400" />;
    if (type.includes("zip") || type.includes("rar")) return <FileArchive className="h-4 w-4 text-yellow-500" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If searching, ignore folder selection and show all matching
    if (searchQuery) return matchesSearch;
    
    // Otherwise filter by active folder
    if (activeFolderId === "favorites") return note.isFavorite;
    if (activeFolderId === "recent") return Date.now() - note.updatedAt < 7 * 24 * 60 * 60 * 1000;
    
    // Show root notes if activeFolderId is null, otherwise show folder's notes
    return activeFolderId ? note.folderId === activeFolderId : !note.folderId;
  });

  return (
    <div className="flex h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] gap-6 pb-20 md:pb-0">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Sidebar for Knowledge Vault */}
      <div className="w-full max-w-[280px] lg:max-w-[320px] flex flex-col gap-4 border-r border-border/50 pr-6 hidden md:flex shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Knowledge Vault</h2>
          <div className="flex gap-1">
            <button 
              onClick={() => {
                const name = prompt("Folder Name:");
                if (name) addFolder(name, activeFolderId && activeFolderId !== "favorites" && activeFolderId !== "recent" ? activeFolderId : undefined);
              }}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="New Folder"
            >
              <FolderIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => addNote(activeFolderId && activeFolderId !== "favorites" && activeFolderId !== "recent" ? activeFolderId : undefined)}
              className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
              title="New Note"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/50 bg-background/50 px-9 py-2 text-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          
          {/* Smart Folders */}
          {!searchQuery && (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Smart Views</h3>
              <button 
                onClick={() => { setActiveFolder("recent"); setActiveNote(null); }}
                className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors", activeFolderId === "recent" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
              >
                <Clock className="h-4 w-4" /> Recent Docs
              </button>
              <button 
                onClick={() => { setActiveFolder("favorites"); setActiveNote(null); }}
                className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors", activeFolderId === "favorites" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
              >
                <Star className="h-4 w-4" /> Favorites
              </button>
            </div>
          )}

          {/* User Folders */}
          {!searchQuery && (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex justify-between items-center">
                Folders
                <button onClick={() => { setActiveFolder(null); setActiveNote(null); }} className="hover:text-primary transition-colors cursor-pointer text-[10px]">ROOT</button>
              </h3>
              {folders.filter(f => !f.parentId).map((folder) => (
                <div key={folder.id}>
                  <div 
                    onClick={() => { setActiveFolder(folder.id); setActiveNote(null); }}
                    className={cn(
                      "group flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                      activeFolderId === folder.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => toggleFolder(folder.id, e)} className="p-0.5 hover:bg-background rounded">
                        {expandedFolders[folder.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                      <FolderIcon className={cn("h-4 w-4", activeFolderId === folder.id && "fill-primary/20")} />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center">
                      <button onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} className="p-1 hover:text-danger rounded">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              {searchQuery ? "Search Results" : "Documents"}
            </h3>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground">
                No documents found.
              </div>
            ) : (
              filteredNotes.map((note) => (
                <motion.div
                  layoutId={note.id}
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all border",
                    activeNoteId === note.id 
                      ? "bg-accent border-border shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate pr-2 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {note.title}
                    </h4>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(note.id);
                      }}
                      className="text-muted-foreground hover:text-warning"
                    >
                      <Star className={cn("h-3 w-3", note.isFavorite && "fill-warning text-warning")} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                    {note.fileIds && note.fileIds.length > 0 && (
                      <span className="text-[10px] font-bold bg-background border border-border/50 px-1.5 rounded-sm text-muted-foreground">
                        {note.fileIds.length} Files
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header / Search (Visible only on mobile when no note selected) */}
      {!activeNoteId && (
        <div className="md:hidden flex flex-col gap-4 w-full h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Vault</h2>
            <button 
              onClick={() => addNote(activeFolderId || undefined)}
              className="p-2 bg-primary/10 text-primary rounded-md"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/50 px-10 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
             {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className="p-4 rounded-xl bg-card/30 border border-border/50 cursor-pointer"
                >
                  <h4 className="text-base font-bold mb-1">{note.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{note.content.replace(/<[^>]*>?/gm, '')}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      {activeNote ? (
        <div className={cn(
          "flex-1 flex flex-col min-w-0 glass-card rounded-2xl border border-border/50 bg-card/20 overflow-hidden",
          !activeNoteId && "hidden md:flex" // Hide on mobile if no note active
        )}>
          {/* Editor Header */}
          <div className="flex flex-col border-b border-border/50 p-4 md:p-6 gap-4 bg-background/30 backdrop-blur-md">
            {/* Mobile Back Button */}
            <div className="md:hidden flex items-center mb-2">
              <button onClick={() => setActiveNote(null)} className="text-sm text-muted-foreground font-medium hover:text-foreground">
                ← Back to Vault
              </button>
            </div>

            <div className="flex items-start justify-between gap-4">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-2xl md:text-3xl font-black bg-transparent outline-none flex-1 placeholder:text-muted-foreground/50 transition-colors focus:text-primary"
                placeholder="Untitled Document"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-background border border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors shadow-sm"
                  title="Attach File"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => toggleFavorite(activeNote.id)}
                  className={cn("p-2 bg-background border border-border/50 rounded-lg transition-colors shadow-sm", activeNote.isFavorite ? "text-warning bg-warning/10" : "text-muted-foreground hover:bg-accent")}
                  title="Favorite"
                >
                  <Star className={cn("h-4 w-4", activeNote.isFavorite && "fill-warning")} />
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Meta Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground bg-accent/50 px-2 py-1 rounded-md">
                <FolderIcon className="h-3 w-3" />
                <span>{folders.find(f => f.id === activeNote.folderId)?.name || "Root"}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground bg-accent/50 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                <span>Last edited: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer bg-accent/50 px-2 py-1 rounded-md transition-colors">
                <Hash className="h-3 w-3" />
                <span>Add Tags</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer bg-accent/50 px-2 py-1 rounded-md transition-colors">
                <LinkIcon className="h-3 w-3" />
                <span>Link Graph</span>
              </div>
            </div>

            {/* File Attachments Zone */}
            {activeNote.fileIds && activeNote.fileIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeNote.fileIds.map(fileId => {
                  const fMeta = files.find(f => f.id === fileId);
                  if (!fMeta) return null;
                  return (
                    <div 
                      key={fileId} 
                      className="flex items-center gap-2 bg-card border border-border/80 rounded-lg pl-3 pr-1 py-1.5 text-sm hover:shadow-md transition-all cursor-pointer group/file"
                      onClick={() => openFileViewer(fileId, fMeta.name)}
                    >
                      {getFileIcon(fMeta.type)}
                      <span className="truncate max-w-[150px] font-medium text-foreground/80 group-hover/file:text-primary transition-colors">{fMeta.name}</span>
                      <button 
                        className="p-1 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded transition-colors ml-1"
                        onClick={(e) => { e.stopPropagation(); removeFileFromNote(activeNote.id, fileId); }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {/* The RichTextEditor handles scrolling internally usually, but we ensure the container is solid */}
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8">
              <RichTextEditor 
                content={activeNote.content} 
                onChange={(content) => updateNote(activeNote.id, { content })} 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center glass-card rounded-2xl border border-border/50 border-dashed bg-background/50">
          <div className="h-20 w-20 bg-card rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border/50 rotate-3">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Knowledge Vault</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            Create rich documents, upload PDFs, attach images, and build your ultimate study repository.
          </p>
          <button 
            onClick={() => addNote(activeFolderId || undefined)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" /> New Document
          </button>
        </div>
      )}
    </div>
  );
}