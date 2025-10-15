import { NextRequest, NextResponse } from "next/server";

// ローカル環境ではダミーデータを使用
const isLocal = process.env.NODE_ENV === "development";

// ダミーボードデータ（ローカル環境用）
const dummyBoards = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designId, designSrc, cardType, recipient, headline, recipientPhoto } = body;

    if (isLocal) {
      // ローカル環境ではランダムIDを生成
      const id = Math.random().toString(36).slice(2, 10);
      
      // ダミーボードデータを保存
      dummyBoards.set(id, {
        id,
        designId,
        designSrc,
        cardType,
        recipient,
        headline,
        recipientPhoto,
        messages: [],
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ 
        success: true, 
        id,
        url: `http://localhost:3000/share/${id}`,
        message: "ローカル環境: ダミーボードが作成されました"
      });
    } else {
      // 本番環境では実際のデータベースに保存
      // TODO: Firebase/Firestoreに保存
      const id = Math.random().toString(36).slice(2, 10);
      
      return NextResponse.json({ 
        success: true, 
        id,
        url: `https://okurun.dev/share/${id}`,
        message: "ボードが作成されました"
      });
    }
  } catch (error) {
    console.error("Board creation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "ボードの作成に失敗しました" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (isLocal) {
    // ローカル環境ではダミーデータを返す
    if (id && dummyBoards.has(id)) {
      return NextResponse.json({ 
        success: true, 
        board: dummyBoards.get(id) 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "ボードが見つかりません" 
      }, { status: 404 });
    }
  } else {
    // 本番環境では実際のデータベースから取得
    // TODO: Firebase/Firestoreから取得
    return NextResponse.json({ 
      success: false, 
      error: "本番環境では実装予定" 
    }, { status: 501 });
  }
}
