import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const { id } = await req.json();
  const supabase = await createClient();

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error }, { status: 500 })
  return Response.json({ success: true })
};
