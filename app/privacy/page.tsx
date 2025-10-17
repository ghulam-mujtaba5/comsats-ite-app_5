import { redirect } from 'next/navigation'
import "./privacy.light.module.css"
import "./privacy.dark.module.css"
export default function PrivacyRedirect(){ redirect('/legal/privacy-policy') }
