import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileType)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    let users = [];

    if (fileType === 'csv') {
      users = parseCSV(fileBuffer);
    } else {
      users = parseExcel(fileBuffer);
    }

    // Validate and clean the data
    const validatedUsers = users
      .filter(user => user.name && user.name.trim()) // Remove rows without names
      .map(user => ({
        name: user.name.trim(),
        alias: user.alias?.trim() || null,
        isAdmin: Boolean(user.isAdmin),
        isTeacher: Boolean(user.isTeacher),
        password: 'defaultpassword123', // Default password for imported users
        isEmailVerified: false,
        solvedChallenges: 0,
        points: 0,

      }));

    return NextResponse.json({ users: validatedUsers });
  } catch (error) {
    console.error('Error parsing file:', error);
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 });
  }
}

function parseCSV(buffer) {
  const text = new TextDecoder().decode(buffer);
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const users = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const user = {};
    
    headers.forEach((header, index) => {
      if (values[index]) {
        user[header] = values[index];
      }
    });
    
    if (user.name) {
      users.push(user);
    }
  }

  return users;
}

function parseExcel(buffer) {
  // For now, we'll return a simple implementation
  // In a real app, you'd use a library like 'xlsx' to parse Excel files
  // For this demo, we'll just return an empty array and suggest using CSV
  return [];
} 