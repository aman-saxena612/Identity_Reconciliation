import { In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Contact } from '../entity/Contact';

export const processIdentifyRequest = async (email?: string, phoneNumber?: string) => {
  const repo = AppDataSource.getRepository(Contact);

  // finding all contacts with matching email or phoneNumber
  const matchedContacts = await repo.find({
    where: [
      email ? { email } : {},
      phoneNumber ? { phoneNumber } : {},
    ],
    relations: ['linkedContact'],
  });

  if (matchedContacts.length === 0) {
    // creating new primary contact if nothing matches
    const newContact = repo.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
    });
    const saved = await repo.save(newContact);
    return {
      primaryContatctId: saved.id,
      emails: [saved.email],
      phoneNumbers: [saved.phoneNumber],
      secondaryContactIds: [],
    };
  }

  // Step 3: Group all related contacts, even indirectly
  const allContacts = (await getAllRelatedContacts(matchedContacts, repo)) as Contact[];

  // Step 4: Determine the primary contact (oldest by createdAt)
  const primaryContact = allContacts.reduce((prev, curr) =>
    prev.createdAt < curr.createdAt ? prev : curr
  );

  // Step 5: Ensure all others are secondary & point to primary
  const updatedSecondaries: Contact[] = [];
  for (const contact of allContacts) {
    if (contact.id !== primaryContact.id && contact.linkPrecedence !== 'secondary') {
      contact.linkPrecedence = 'secondary';
      contact.linkedContact = primaryContact;
      updatedSecondaries.push(contact);
    } else if (
      contact.linkPrecedence === 'secondary' &&
      contact.linkedContact?.id !== primaryContact.id
    ) {
      contact.linkedContact = primaryContact;
      updatedSecondaries.push(contact);
    }
  }
  if (updatedSecondaries.length) await repo.save(updatedSecondaries);

  // Step 6: If any new info is present, create a new secondary
  const alreadyExists = allContacts.some(
    (c) => c.email === email && c.phoneNumber === phoneNumber
  );
  if (!alreadyExists && (email || phoneNumber)) {
    const newSecondary = repo.create({
      email,
      phoneNumber,
      linkedContact: primaryContact,
      linkPrecedence: 'secondary',
    });
    await repo.save(newSecondary);
    allContacts.push(newSecondary);
  }

  // Step 7: Build the response
  const emails = [
    ...new Set(
      allContacts.map((c) => c.email).filter(Boolean)
    ),
  ];
  const phoneNumbers = [
    ...new Set(
      allContacts.map((c) => c.phoneNumber).filter(Boolean)
    ),
  ];
  const secondaryContactIds = allContacts
    .filter((c) => c.linkPrecedence === 'secondary')
    .map((c) => c.id);

  return {
    primaryContatctId: primaryContact.id,
    emails,
    phoneNumbers,
    secondaryContactIds,
  };
};

// Helper to collect all related contacts (by link chain)
const getAllRelatedContacts = async (
  baseContacts: Contact[],
  repo: ReturnType<typeof AppDataSource.getRepository>
): Promise<Contact[]> => {
  const visited = new Set<number>();
  const toVisit = [...baseContacts];

  while (toVisit.length) {
    const current = toVisit.pop()!;
    if (visited.has(current.id)) continue;

    visited.add(current.id);

    const linked = (await repo.find({
      where: [
        { linkedContact: { id: current.id } },
        { id: current.linkedContact?.id },
      ],
      relations: ['linkedContact'],
    })) as Contact[];

    for (const contact of linked) {
      if (!visited.has(contact.id)) {
        toVisit.push(contact as Contact);
      }
    }
  }

  return await repo.find({
  where: {
    id: In(Array.from(visited)),
  },
}) as Contact[];
};
