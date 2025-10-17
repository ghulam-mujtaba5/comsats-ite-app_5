import { redirect } from 'next/navigation'
import "./terms.light.module.css"
import "./terms.dark.module.css"
export default function TermsRedirect(){ redirect('/legal/terms-of-service') }
