export const PUBLIC_CONTACT_EMAIL = 'HealthyRiversandLandscapes@resources.ca.gov'

const GENERAL_CONTACT_SUBJECT = 'Question about the Healthy Rivers and Landscapes Restoration Dashboard'

function createMailto(subject: string): string {
  return `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}

export function getGeneralContactMailto(): string {
  return createMailto(GENERAL_CONTACT_SUBJECT)
}

export function getProjectContactMailto(projectName: string): string {
  return createMailto(`Question about ${projectName}`)
}
