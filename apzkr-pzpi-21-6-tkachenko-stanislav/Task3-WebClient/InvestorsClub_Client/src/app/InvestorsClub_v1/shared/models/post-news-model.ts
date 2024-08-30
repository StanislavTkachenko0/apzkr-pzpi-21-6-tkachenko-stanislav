export interface PostNews {
  id?: number | undefined,
  startupId?: number,
  headline?: string,
  text?: string,
  photoUrl?: string
  publicationDate: Date,
  isLoading?: boolean
}
