import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { DatabaseError } from "./appError";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const STORAGE_BUCKET = "images";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  // Validate file
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new DatabaseError(
      "Invalid file type. Only JPEG, PNG and WebP allowed."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new DatabaseError("File too large. Maximum size is 5MB.");
  }

  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        duplex: "half",
        upsert: false,
      });

    if (uploadError) {
      throw new DatabaseError(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    throw new DatabaseError(`Image upload failed: ${error.message}`);
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const fileName = url.split("/").pop();
    if (!fileName) throw new DatabaseError("Invalid image URL");

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);

    if (error) {
      throw new DatabaseError(`Deletion failed: ${error.message}`);
    }
  } catch (error) {
    throw new DatabaseError(`Image deletion failed: ${error.message}`);
  }
}
