import EditPayForm from '@/app/ui/pays/edit-form';
import Breadcrumbs from '@/app/ui/pays/breadcrumbs';
import { fetchContacts, fetchPayById } from '@/app/lib/data';

type PageProps = {
    params: { id: string };
  };

export default async function Page( {params} : PageProps) {
    const contacts = await fetchContacts();
    const { id } = await params;
    const pay = await fetchPayById(id);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Pays', href: `/dashboard/pays/edit/${id}` },
                    {
                        label: 'Edit Pay',
                        href: '/dashboard/pays/edit',
                        active: true,
                    },
                ]}
            />
            <EditPayForm contacts={contacts} pay={pay}/>
        </main>
    );
}