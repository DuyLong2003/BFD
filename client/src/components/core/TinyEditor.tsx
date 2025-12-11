'use client';

import { Editor } from '@tinymce/tinymce-react';
import { fileService } from '@/services/file.service';

interface TinyEditorProps {
    value?: string;
    onChange?: (content: string) => void;
}

export default function TinyEditor({ value, onChange }: TinyEditorProps) {
    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={value || ''}
            onEditorChange={(content: any) => {
                if (onChange) {
                    onChange(content);
                }
            }}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image | help',
                content_style: 'body { font-family:Inter,sans-serif; font-size:14px }',
                // Xử lý upload ảnh
                images_upload_handler: async (blobInfo: any) => {
                    try {
                        const res = await fileService.upload(blobInfo.blob() as File);
                        return res.url;
                    } catch (e) {
                        throw new Error('Upload failed');
                    }
                }
            }}
        />
    );
}