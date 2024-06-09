import  { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Testing() {

    const [value, setValue] = useState('');

    return (
        <div>
            <ReactQuill theme="snow" value={value} onChange={setValue} />;
        </div>

    )
}
