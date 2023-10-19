interface DataRow {
  a_id: number;
  b_ownerAddressBook: string;
  c_recipientAddress: string;
  d_name: string;
}

export function createAddressBook(
  data: DataRow[],
  ownerAddress: string | undefined
): Record<string, string> {
  const addressBook: Record<string, string> = {};
  data.forEach((row) => {
    if (row.b_ownerAddressBook === ownerAddress) {
      const recipientAddress = row.c_recipientAddress;
      const name = row.d_name;
      addressBook[recipientAddress] = name;
    }
  });
  return addressBook;
}
