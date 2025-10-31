import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const { id, nome } = await req.json();
  const supabase = await createClient();

  const { error } = await supabase
    .from('services')
    .update({ nome })
    .eq('id', id)

  if (error) return Response.json({ error }, { status: 500 })
  return Response.json({ success: true })
};
