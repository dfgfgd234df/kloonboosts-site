import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth');
  
  if (adminAuth?.value === 'true') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
