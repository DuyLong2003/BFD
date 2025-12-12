'use client';

import { Editor } from '@tinymce/tinymce-react';
import { fileService } from '@/services/file.service';
import { message } from 'antd';

interface TinyEditorProps {
    value?: string;
    onChange?: (content: string) => void;
}

interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
}

type ProgressFn = (percent: number) => void;

export default function TinyEditor({ value, onChange }: TinyEditorProps) {
    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={value || ''}
            onEditorChange={(content: string) => {
                onChange?.(content);
            }}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image media | help',
                content_style: 'body { font-family:Inter,sans-serif; font-size:14px }',

                // Config upload ảnh
                automatic_uploads: true,
                paste_data_images: true,
                file_picker_types: 'image',
                images_file_types: 'jpg,jpeg,png,gif,webp',

                // Upload handler
                images_upload_handler: async (
                    blobInfo: BlobInfo,
                    progress: ProgressFn
                ): Promise<string> => {
                    try {
                        const blob = blobInfo.blob();
                        const filename = blobInfo.filename() ||
                            `image-${Date.now()}.${blob.type.split('/')[1]}`;

                        const file = new File([blob], filename, { type: blob.type });
                        const res = await fileService.upload(file);

                        message.success('Đã upload ảnh');
                        return res.url;
                    } catch (error) {
                        console.error('TinyMCE upload failed:', error);
                        message.error('Upload ảnh thất bại');
                        throw error;
                    }
                },
            }}
        />
    );
}