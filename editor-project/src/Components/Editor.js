import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null)
    const cursorMarkerRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes
                const code = instance.getValue()
                onCodeChange(code)
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    })
                }
            })

            //Listening from backend
            // socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            //     if (code !== null) {
            //         editorRef.current.setValue(code)
            //     }
            // })
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code)
                }
            })
        }
    }, [socketRef.current])
    return <textarea id="realtimeEditor"></textarea>;
}

export default Editor;
