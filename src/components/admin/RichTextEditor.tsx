import { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import api from '../../lib/api';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              const toastId = toast.loading('Uploading image...');
              try {
                const formData = new FormData();
                formData.append('image', file);
                const res = await api.post('/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                
                const url = res.data.url;
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  const range = quill.getSelection(true);
                  if (range) {
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                  }
                }
                toast.success('Image uploaded', { id: toastId });
              } catch (err: any) {
                toast.error(err.response?.data?.message || 'Failed to upload image', { id: toastId });
              }
            };
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Stop Quill from inserting base64 automatically
        
        const file = items[i].getAsFile();
        if (!file) continue;

        const toastId = toast.loading('Uploading pasted image...');
        try {
          const formData = new FormData();
          formData.append('image', file);
          const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          const url = res.data.url;
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            if (range) {
              quill.insertEmbed(range.index, 'image', url);
              quill.setSelection(range.index + 1);
            }
          }
          toast.success('Image uploaded', { id: toastId });
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to upload image', { id: toastId });
        }
      }
    }
  };

  return (
    <div 
      className="rich-text-editor-container bg-black/40 border border-white/10 rounded-xl overflow-hidden" 
      onPaste={handlePaste}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Write your content here...'}
        className="text-white"
      />
      <style>{`
        /* Overriding React Quill default theme for our dark mode */
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.5);
          padding: 12px;
        }
        .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 15px;
          min-height: 250px;
        }
        .ql-editor {
          min-height: 250px;
          color: rgba(255,255,255,0.9);
        }
        .ql-snow .ql-stroke {
          stroke: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
          fill: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-picker {
          color: rgba(255,255,255,0.7);
        }
        .ql-snow .ql-picker-options {
          background-color: #111;
          border-color: rgba(255,255,255,0.1);
        }
        .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.3);
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
