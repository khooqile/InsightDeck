// (Conceptual update to src/lib/pdfHistory.ts)

import { supabase } from '@/lib/supabase'; // Assuming supabase is initialized elsewhere

// MODIFIED: Now returns the ID of the newly created history item
export async function addPdfToHistory(pdfName: string, userId: string) {
  try {
    // Note the .select('id') and .single() to get the primary key back
    const { data, error } = await supabase
      .from('pdf_history')
      .insert([
        {
          user_id: userId,
          pdf_name: pdfName,
        },
      ])
      .select('id') 
      .single();

    if (error) {
      console.error('error adding PDF to history:', error);
      return { success: false, error };
    }

    return { success: true, historyItemId: data.id };
  } catch (error) {
    console.error('error adding PDF to history:', error);
    return { success: false, error };
  }
}

// NEW FUNCTION: Deletes a specific history item
export async function deletePdfFromHistory(itemId: string) {
  try {
    const { error } = await supabase
      .from('pdf_history')
      .delete()
      .eq('id', itemId); // Assuming 'id' is the primary key

    if (error) {
      console.error('error deleting PDF from history:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('error deleting PDF from history:', error);
    return { success: false, error };
  }
}