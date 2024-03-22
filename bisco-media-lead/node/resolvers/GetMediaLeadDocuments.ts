import { MEDIA_LINKS_ACRONYM, MEDIA_LINK_FIELDS, MEDIA_LINK_SCHEMA } from "../utils/const"

interface Args {
  where: string
}

export const getMediaLeadDocuments= async (
  _: any,
  args:Args,
  ctx: any
) => {
  const {
    clients: { masterdata },
  } = ctx;

  const res = await masterdata.searchDocumentsWithPaginationInfo({
    dataEntity: MEDIA_LINKS_ACRONYM,
    schema: MEDIA_LINK_SCHEMA,
    fields: MEDIA_LINK_FIELDS,
    pagination: { pageSize: 100, page: 1 },
    where: args.where,
  });

  return res.data
}
