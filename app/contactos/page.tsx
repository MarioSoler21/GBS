'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ContactsTable from '@/components/contactos/ContactsTable';
import { contacts } from '@/lib/mock-data';
import type { BusinessUnit } from '@/lib/types';

export default function ContactosPage() {
  const [selectedUnit, setSelectedUnit] = useState<'Todas' | BusinessUnit>('Todas');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="Contactos"
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <ContactsTable contacts={contacts} />
      </div>
    </div>
  );
}
