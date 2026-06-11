import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Code, Heading1, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('heading', { level: 1 }) && "bg-accent text-foreground")}
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('heading', { level: 2 }) && "bg-accent text-foreground")}
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('bold') && "bg-accent text-foreground")}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('italic') && "bg-accent text-foreground")}
      >
        <Italic className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('bulletList') && "bg-accent text-foreground")}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('orderedList') && "bg-accent text-foreground")}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('codeBlock') && "bg-accent text-foreground")}
      >
        <Code className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn("p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors", editor.isActive('blockquote') && "bg-accent text-foreground")}
      >
        <Quote className="h-4 w-4" />
      </button>
      <div className="flex-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your notes here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert prose-p:leading-relaxed prose-pre:bg-card prose-pre:border prose-pre:border-border focus:outline-none max-w-none min-h-[500px] p-6',
      },
    },
  });

  // Update editor content when external content changes (like selecting a different note)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
