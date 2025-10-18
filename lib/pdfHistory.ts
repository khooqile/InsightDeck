import { supabase } from '@/lib/supabase';

export async function addPdfToHistory(pdfName: string, userId: string) {
  try {
    const { error } = await supabase
      .from('pdf_history')
      .insert([
        {
          user_id: userId,
          pdf_name: pdfName,
        },
      ]);

    if (error) {
      console.error('Error adding PDF to history:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding PDF to history:', error);
    return { success: false, error };
  }
}
