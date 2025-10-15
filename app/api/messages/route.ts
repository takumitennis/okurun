import { NextRequest, NextResponse } from "next/server";

// ローカル環境ではダミーデータを使用
const isLocal = process.env.NODE_ENV === "development";

// ダミーメッセージデータ（ローカル環境用）
const dummyMessages = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { boardId, name, message, photo } = body;

    if (isLocal) {
      // ローカル環境ではダミーデータに追加
      const messages = dummyMessages.get(boardId) || [];
      const newMessage = {
        id: Math.random().toString(36).slice(2, 10),
        name,
        message,
        photo,
        createdAt: new Date().toISOString(),
      };
      messages.push(newMessage);
      dummyMessages.set(boardId, messages);

      return NextResponse.json({ 
        success: true, 
        message: newMessage,
        totalMessages: messages.length
      });
    } else {
      // 本番環境では実際のデータベースに保存
      // TODO: Firebase/Firestoreに保存
      return NextResponse.json({ 
        success: true, 
        message: "本番環境では実装予定"
      });
    }
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "メッセージの投稿に失敗しました" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");

  if (isLocal) {
    // ローカル環境ではダミーデータを返す
    const messages = dummyMessages.get(boardId || "") || [];
    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } else {
    // 本番環境では実際のデータベースから取得
    // TODO: Firebase/Firestoreから取得
    return NextResponse.json({ 
      success: false, 
      error: "本番環境では実装予定" 
    }, { status: 501 });
  }
}
