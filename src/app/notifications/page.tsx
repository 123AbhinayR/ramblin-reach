import {requireMember} from '@/lib/auth/guard';
import {WorkspaceNav} from '@/components/workspace-nav';
import {Notifications} from '@/components/notifications';
export const dynamic='force-dynamic';
export default async function NotificationsPage(){await requireMember();return <section className="container workspace"><WorkspaceNav/><h1>Your updates</h1><Notifications/></section>;}
