"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Youtube,
  Code,
  Quote,
  Hash,
  Smile
} from "lucide-react"
import { MediaUploader } from "@/components/community/media-uploader"

// Lexical imports
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, $getSelection, $createParagraphNode, $createTextNode } from "lexical"
import { HeadingNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { LinkNode } from "@lexical/link"
import { $generateHtmlFromNodes } from "@lexical/html"

interface RichTextEditorEnhancedProps {
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
    <div id="toolbar" className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-muted">
      <Button variant="ghost" size="sm" type="button" className="p-1" onClick={() => formatText('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1" onClick={() => formatText('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1" onClick={() => formatText('underline')}>
        <Underline className="h-4 w-4" />
      </Button>
      <div className="border-l mx-1 h-6 self-center"></div>
      <Button variant="ghost" size="sm" type="button" className="p-1" onClick={() => editor.dispatchCommand('insert_unordered_list' as any, undefined)}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1" onClick={() => editor.dispatchCommand('insert_ordered_list' as any, undefined)}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="border-l mx-1 h-6 self-center"></div>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Image className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Youtube className="h-4 w-4" />
      </Button>
      <div className="border-l mx-1 h-6 self-center"></div>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Code className="h-4 w-4" />
      </Button>
      <div className="border-l mx-1 h-6 self-center"></div>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Hash className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" type="button" className="p-1">
        <Smile className="h-4 w-4" />
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

export function RichTextEditorEnhanced({
  value,
  onChange,
  placeholder = "Write something...",
  className = ""
}: RichTextEditorEnhancedProps) {
  const [isClient, setIsClient] = useState(false)
  const [showMediaUploader, setShowMediaUploader] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Lexical editor configuration
  const initialConfig = {
    namespace: 'EnhancedCommunityEditor',
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

  if (!isClient) {
    return (
      <div className={`min-h-[150px] p-3 border rounded-md bg-muted ${className}`}>
        <p className="text-muted-foreground">{placeholder}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        
        {/* Editor */}
        <div className="min-h-[150px]">
          <RichTextPlugin
            contentEditable={<ContentEditable className="min-h-[150px] p-4" />}
            placeholder={<div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">{placeholder}</div>}
            ErrorBoundary={EditorErrorBoundary}
          />
          <HistoryPlugin />
          <HtmlOnChangePlugin onChange={onChange} />
          <InitialContentPlugin content={value} />
        </div>
      </LexicalComposer>

      {/* Media Uploader */}
      {showMediaUploader && (
        <MediaUploader
          onMediaChange={(files) => {
            // In a real implementation, you would upload files and insert URLs
            // For now, we'll just close the uploader
            setShowMediaUploader(false)
          }}
          maxFiles={5}
        />
      )}

      {/* Character count */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{value.length}/5000 characters</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Hash className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Smile className="h-3 w-3 mr-1" />
            Emoji
          </Button>
        </div>
      </div>
    </div>
  )
}