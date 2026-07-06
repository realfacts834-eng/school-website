"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Highlighter,
  SeparatorHorizontal,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { toast } from "sonner";

// ==========================================
// Types
// ==========================================
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  minHeight?: string;
  readOnly?: boolean;
}

// ==========================================
// RichTextEditor Component
// ==========================================
export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  label,
  error,
  minHeight = "300px",
  readOnly = false,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ImageExtension.configure({
        allowBase64: true,
        inline: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      TextStyle,
      Color,
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "tiptap-editor prose prose-sm dark:prose-invert max-w-none focus:outline-none",
          "p-4 md:p-6",
          readOnly && "cursor-default"
        ),
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Add image via URL
  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url, alt: "Image" }).run();
      toast.showToast("Image added");
    }
  }, [editor]);

  // Add link
  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "https://");
    
    if (url === null) return; // Cancelled
    
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Add horizontal rule
  const addHorizontalRule = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border rounded-lg p-8 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Toolbar Button Component
  const ToolbarButton = ({
    onClick,
    active,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded transition-colors",
        "hover:bg-muted/80",
        active && "bg-primary/10 text-primary",
        disabled && "opacity-40 cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      )}
      type="button"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  const Separator = () => <div className="w-px h-5 bg-border mx-0.5" />;

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}

      <div
        className={cn(
          "border rounded-lg overflow-hidden transition-all",
          error ? "border-red-500 ring-1 ring-red-500/20" : "border-input",
          isFullscreen && "fixed inset-0 z-50 bg-background"
        )}
      >
        {/* Toolbar */}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/20">
            {/* Formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive("highlight")}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </ToolbarButton>

            <Separator />

            {/* Headings */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <Separator />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              active={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              active={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <Separator />

            {/* Lists & Block */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={addHorizontalRule}
              title="Horizontal Rule"
            >
              <SeparatorHorizontal className="h-4 w-4" />
            </ToolbarButton>

            <Separator />

            {/* Media */}
            <ToolbarButton onClick={addLink} title="Add Link">
              <Link className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Add Image">
              <Image className="h-4 w-4" />
            </ToolbarButton>

            <Separator />

            {/* History */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>

            {/* Right-side controls */}
            <div className="flex-1" />
            
            <ToolbarButton
              onClick={() => setIsPreview(!isPreview)}
              active={isPreview}
              title={isPreview ? "Edit" : "Preview"}
            >
              {isPreview ? (
                <Edit3 className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </ToolbarButton>
          </div>
        )}

        {/* Editor Content */}
        <div className={cn(isPreview && "hidden")}>
          <EditorContent editor={editor} />
        </div>

        {/* Preview Mode */}
        {isPreview && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none p-4 md:p-6"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// ==========================================
// CSS for TipTap Editor
// ==========================================
export const tiptapStyles = `
  .tiptap-editor p.is-editor-empty:first-child::before {
    color: var(--muted-foreground);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    font-size: 0.875rem;
  }
  
  .tiptap-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }
  
  .tiptap-editor blockquote {
    border-left: 3px solid var(--primary);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--muted-foreground);
  }
  
  .tiptap-editor pre {
    background: var(--muted);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  
  .tiptap-editor code {
    background: var(--muted);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  .tiptap-editor mark {
    background: rgba(255, 213, 0, 0.3);
    padding: 0.1rem 0.2rem;
    border-radius: 0.125rem;
  }
`;