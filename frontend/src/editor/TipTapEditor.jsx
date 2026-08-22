import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Pilcrow,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

const Toolbar = ({ editor, disabled }) => {
  if (!editor) return null;

  const btnClass = (isActive = false, canExecute = true) =>
    `p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
      isActive
        ? 'bg-slate-700 text-white shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    } ${!canExecute || disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 sticky top-0 z-10 rounded-t-xl">
      {/* History */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
          className={btnClass(false, editor.can().undo())}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
          className={btnClass(false, editor.can().redo())}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Formatting */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('underline'))}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Headings & Paragraph */}
      <div className="flex items-center gap-0.5 px-2 border-r border-slate-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('paragraph'))}
          title="Paragraph"
        >
          <Pilcrow className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 pl-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={btnClass(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TipTapEditor = ({ content, onChange, readOnly = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
    ],
    content: content || '<p></p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  // Keep content synchronized if prop changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  return (
    <div className="bg-slate-950/70 rounded-xl border border-slate-800/80 shadow-2xl overflow-hidden min-h-[550px] flex flex-col">
      <Toolbar editor={editor} disabled={readOnly} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
