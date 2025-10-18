"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Smile,
  Paperclip,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

// Lexical imports
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import { $generateNodesFromDOM } from "@lexical/html"
import { HeadingNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { LinkNode } from "@lexical/link"
import { $generateHtmlFromNodes } from "@lexical/html"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Custom toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  
  const formatText = (command: string) => {
    editor.dispatchCommand(command as any, undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatText('bold')}
        className="h-8 px-2"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatText('italic')}
        className="h-8 px-2"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => formatText('underline')}
        className="h-8 px-2"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand('insert_unordered_list' as any, undefined)}
        className="h-8 px-2"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand('insert_ordered_list' as any, undefined)}
        className="h-8 px-2"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Custom plugin to handle initial content
function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext()
  
  // Set initial content
  useEffect(() => {
    if (content) {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
        
        // For now, we'll convert HTML to nodes when we have that functionality
        // For simplicity, we'll treat content as plain text for now
        const paragraph = $createParagraphNode()
        const textNode = $createTextNode(content)
        paragraph.append(textNode)
        root.append(paragraph)
      })
    }
  }, [content, editor])
  
  return null
}

// Error boundary component
function EditorErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

// Custom plugin to handle HTML content changes
function HtmlOnChangePlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null)
        onChange(html)
      })
    })
  }, [editor, onChange])
  
  return null
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your post content here...",
  className 
}: RichTextEditorProps) {
  const [isEditorFocused, setIsEditorFocused] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lexical editor configuration
  const initialConfig = {
    namespace: 'CommunityEditor',
    theme: {
      ltr: 'ltr',
      rtl: 'rtl',
      placeholder: 'editor-placeholder',
      paragraph: 'editor-paragraph',
      quote: 'editor-quote',
      heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
      },
      list: {
        nested: {
          listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
      },
      link: 'editor-link',
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
        code: 'editor-text-code',
      },
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      LinkNode,
    ],
    onError: (error: Error) => {
      console.error(error)
    },
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Handle file upload logic here
      // This would typically involve uploading to a storage service
      // and inserting the URL into the editor
      console.log("Files selected:", files)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className={cn("border rounded-lg bg-background", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        
        <div className="min-h-[200px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[200px] p-4" />}
            placeholder={<div className="absolute top-4 left-4 text-slate-700 dark:text-slate-300 pointer-events-none">{placeholder}</div>}
            ErrorBoundary={EditorErrorBoundary}
          />
          <HistoryPlugin />
          <HtmlOnChangePlugin onChange={onChange} />
          <InitialContentPlugin content={value} />
        </div>
      </LexicalComposer>
      
      {/* Preview of uploaded files */}
      <div className="p-2 border-t border-border">
        <div className="text-xs text-slate-700 dark:text-slate-300 mb-2">
          Attachments (0)
        </div>
        {/* File previews would go here */}
      </div>
    </div>
  )
}