import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORAGE_BUCKET = "products"; // Change this to your Supabase bucket name

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  // Supabase doesn't require the full URL for deletion, just the filename
  const fileName = url.split("/").pop(); // Assuming the URL format is consistent

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .delete(fileName);

  if (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
}
