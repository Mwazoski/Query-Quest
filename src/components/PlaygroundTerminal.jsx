"use client";

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import xterm to avoid SSR issues
const Terminal = dynamic(() => import('@xterm/xterm'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black text-green-400 p-4 font-mono text-sm">
      <div className="mb-2">SQL Playground Terminal</div>
      <div className="text-gray-500">Loading terminal...</div>
      <div className="mt-4 text-xs">
        <div>Available commands:</div>
        <div>• SELECT * FROM users;</div>
        <div>• DESCRIBE challenges;</div>
        <div>• SHOW TABLES;</div>
      </div>
    </div>
  )
})

const PlaygroundTerminal = () => {
  const [isClient, setIsClient] = useState(false);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !terminalRef.current) return;

    const initTerminal = async () => {
      try {
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        
        // Create terminal instance
        const term = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          theme: {
            background: '#000000',
            foreground: '#00ff00',
            cursor: '#00ff00',
            selection: '#ffffff',
            black: '#000000',
            red: '#ff0000',
            green: '#00ff00',
            yellow: '#ffff00',
            blue: '#0000ff',
            magenta: '#ff00ff',
            cyan: '#00ffff',
            white: '#ffffff',
            brightBlack: '#666666',
            brightRed: '#ff6666',
            brightGreen: '#66ff66',
            brightYellow: '#ffff66',
            brightBlue: '#6666ff',
            brightMagenta: '#ff66ff',
            brightCyan: '#66ffff',
            brightWhite: '#ffffff'
          }
        });

        // Add fit addon
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        // Open terminal
        term.open(terminalRef.current);
        fitAddon.fit();

        // Handle data
        term.onData((data) => {
          console.log(`Received data: ${data}`);
          // Echo back for now
          term.write(data);
        });

        // Handle resize
        const handleResize = () => {
          fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        // Write welcome message
        term.writeln('\x1b[1;32mSQL Playground Terminal\x1b[0m');
        term.writeln('\x1b[33mAvailable commands:\x1b[0m');
        term.writeln('• SELECT * FROM users;');
        term.writeln('• DESCRIBE challenges;');
        term.writeln('• SHOW TABLES;');
        term.writeln('');

        xtermRef.current = term;

        return () => {
          window.removeEventListener('resize', handleResize);
          term.dispose();
        };
      } catch (error) {
        console.error('Error initializing terminal:', error);
      }
    };

    initTerminal();
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-black text-green-400 p-4 font-mono text-sm">
        <div className="mb-2">SQL Playground Terminal</div>
        <div className="text-gray-500">Loading terminal...</div>
        <div className="mt-4 text-xs">
          <div>Available commands:</div>
          <div>• SELECT * FROM users;</div>
          <div>• DESCRIBE challenges;</div>
          <div>• SHOW TABLES;</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-b-lg overflow-hidden">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  )
}

export default PlaygroundTerminal;