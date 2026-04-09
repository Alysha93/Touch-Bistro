import KDSClient from './KDSClient';
import { getActiveTickets } from './actions';

export default async function KDSPage() {
  const initialTickets = await getActiveTickets();
  return <KDSClient initialTickets={initialTickets} />;
}
