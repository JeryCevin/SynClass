import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use service_role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This must be set in .env.local (not NEXT_PUBLIC_)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      username,
      role,
      nim,
      nidn,
      jurusan,
      fakultas,
      angkatan,
    } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["student", "dosen", "kaprodi"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Role harus salah satu dari: student, dosen, kaprodi" },
        { status: 400 }
      );
    }

    // Create user in auth.users using Admin API
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          username: username || email.split("@")[0],
          role: role || "student",
        },
      });

    if (authError) {
      console.error("Auth create error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Gagal membuat user" },
        { status: 500 }
      );
    }

    // Create/update profile in profiles table
    const profileData: any = {
      id: authData.user.id,
      username: username || email.split("@")[0],
      role: role || "student",
      updated_at: new Date().toISOString(),
    };

    // Add optional fields
    if (jurusan) profileData.jurusan = jurusan;
    if (fakultas) profileData.fakultas = fakultas;
    if (angkatan) profileData.angkatan = parseInt(angkatan);

    // NIM for students (bigint), NIDN for dosen/kaprodi (text)
    if (role === "student" && nim) {
      profileData.nim = parseInt(nim);
    } else if ((role === "dosen" || role === "kaprodi") && nidn) {
      profileData.nidn = nidn;
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(profileData, { onConflict: "id" });

    if (profileError) {
      console.error("Profile create error:", profileError);
      // User was created in auth but profile failed - try to clean up
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Gagal membuat profil: " + profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil dibuat",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: profileData.username,
        role: profileData.role,
      },
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
