"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Loader2, RefreshCw, LogOut, LogIn, Wand2, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface LogEntry {
  id: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  timestamp: Date
}

interface SessionStatus {
  loggedIn: boolean
  email?: string
  userId?: string
  isAdmin: boolean
  role?: string
  checked: boolean
}

export default function AdminDiagnosticPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [status, setStatus] = useState<SessionStatus>({
    loggedIn: false,
    isAdmin: false,
    checked: false
  })
  const [isRunning, setIsRunning] = useState(false)
  const [autoFixSuggestion, setAutoFixSuggestion] = useState<string>('')
  const [isFixing, setIsFixing] = useState(false)
  const [showAutoFix, setShowAutoFix] = useState(false)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { 
      id: Date.now(), 
      message, 
      type, 
      timestamp: new Date() 
    }])
  }

  const clearLogs = () => {
    setLogs([])
    addLog('Logs cleared', 'info')
  }

  const testSession = async () => {
    addLog('Testing session...', 'info')
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      
      if (data.user) {
        addLog(`✓ Logged in as: ${data.user.email}`, 'success')
        setStatus(prev => ({
          ...prev,
          loggedIn: true,
          email: data.user.email,
          userId: data.user.id
        }))
        return true
      } else {
        addLog('✗ Not logged in', 'error')
        setAutoFixSuggestion('You need to sign in first')
        setStatus(prev => ({ ...prev, loggedIn: false }))
        return false
      }
    } catch (e: any) {
      addLog(`✗ Session check failed: ${e.message}`, 'error')
      return false
    }
  }

  const testAdminElevate = async () => {
    addLog('Testing admin elevation...', 'info')
    try {
      const res = await fetch('/api/admin/session/elevate', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        addLog(`✓ Admin access granted! Role: ${data.role}`, 'success')
        setStatus(prev => ({ ...prev, isAdmin: true, role: data.role }))
        setAutoFixSuggestion('')
        return true
      } else {
        addLog(`✗ Access denied (${res.status})`, 'error')
        addLog(`  Error: ${data.error}`, 'error')
        
        if (data.details) addLog(`  Details: ${data.details}`, 'warning')
        if (data.fix) {
          addLog(`  Fix: ${data.fix}`, 'info')
          setAutoFixSuggestion(data.fix)
        }
        if (data.userEmail) addLog(`  Your email: ${data.userEmail}`, 'info')
        if (data.userId) addLog(`  Your ID: ${data.userId}`, 'info')
        if (data.hint) addLog(`  Hint: ${data.hint}`, 'warning')
        
        // Generate SQL fix if user not in admin table
        if (data.userId && data.error?.includes('not in the admin_users table')) {
          const sqlFix = `INSERT INTO admin_users (user_id, role, permissions)\nVALUES ('${data.userId}', 'super_admin', ARRAY['all']);`
          addLog('═══════════════════════════════════════', 'info')
          addLog('SQL FIX (Copy to Supabase SQL Editor):', 'success')
          addLog(sqlFix, 'success')
          addLog('═══════════════════════════════════════', 'info')
        }
        
        setStatus(prev => ({ ...prev, isAdmin: false }))
        return false
      }
    } catch (e: any) {
      addLog(`✗ Elevation test failed: ${e.message}`, 'error')
      return false
    }
  }

  const testAdminAPI = async () => {
    addLog('Testing admin API endpoint...', 'info')
    try {
      const res = await fetch('/api/admin/session')
      const data = await res.json()
      
      if (res.ok) {
        addLog(`✓ Admin API access OK`, 'success')
        if (data.role) addLog(`  Role: ${data.role}`, 'success')
        if (data.dev) addLog(`  Dev mode: ${data.dev}`, 'warning')
        return true
      } else {
        addLog(`✗ Admin API denied (${res.status})`, 'error')
        return false
      }
    } catch (e: any) {
      addLog(`✗ Admin API test failed: ${e.message}`, 'error')
      return false
    }
  }

  const runFullDiagnostic = async () => {
    setIsRunning(true)
    setAutoFixSuggestion('')
    clearLogs()
    
    addLog('═══════════════════════════════════════', 'info')
    addLog('🔍 STARTING FULL DIAGNOSTIC', 'info')
    addLog('═══════════════════════════════════════', 'info')
    
    // Test 1: Session
    addLog('\n[TEST 1/3] Checking authentication...', 'info')
    const sessionOk = await testSession()
    
    if (!sessionOk) {
      addLog('\n❌ DIAGNOSTIC STOPPED: Not signed in', 'error')
      addLog('Next step: Click "Sign In" button below', 'warning')
      setIsRunning(false)
      setStatus(prev => ({ ...prev, checked: true }))
      return
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Test 2: Admin Elevation
    addLog('\n[TEST 2/3] Checking admin access...', 'info')
    const adminOk = await testAdminElevate()
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Test 3: Admin API
    if (adminOk) {
      addLog('\n[TEST 3/3] Verifying admin API...', 'info')
      await testAdminAPI()
    }
    
    // Final summary
    addLog('\n═══════════════════════════════════════', 'info')
    if (adminOk) {
      addLog('✅ DIAGNOSTIC COMPLETE: All tests passed!', 'success')
      addLog('You have full admin access.', 'success')
      setShowAutoFix(false)
    } else {
      addLog('❌ DIAGNOSTIC COMPLETE: Admin access denied', 'error')
      addLog('Check the fix suggestions above.', 'warning')
      if (process.env.NODE_ENV !== 'production') {
        addLog('\n💡 TIP: Click "Auto-Fix" button to grant admin access automatically', 'info')
        setShowAutoFix(true)
      }
    }
    addLog('═══════════════════════════════════════', 'info')
    
    setIsRunning(false)
    setStatus(prev => ({ ...prev, checked: true }))
  }

  const handleSignOut = async () => {
    addLog('Signing out...', 'info')
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      addLog('✓ Signed out successfully', 'success')
      setTimeout(() => window.location.reload(), 1000)
    } catch (e: any) {
      addLog(`✗ Sign out failed: ${e.message}`, 'error')
    }
  }

  const handleAutoFix = async () => {
    setIsFixing(true)
    addLog('\n═══════════════════════════════════════', 'info')
    addLog('🪄 ATTEMPTING AUTO-FIX...', 'info')
    addLog('═══════════════════════════════════════', 'info')
    
    try {
      const res = await fetch('/api/admin/auto-fix', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok && data.success) {
        addLog('✓ Auto-fix successful!', 'success')
        addLog(`  ${data.message}`, 'success')
        if (data.details) addLog(`  ${data.details}`, 'success')
        addLog('\n⏳ Re-running diagnostic in 2 seconds...', 'info')
        
        setTimeout(() => {
          runFullDiagnostic()
        }, 2000)
      } else {
        addLog(`✗ Auto-fix failed: ${data.error || data.message}`, 'error')
        if (data.details) addLog(`  ${data.details}`, 'warning')
        if (data.hint) addLog(`  Hint: ${data.hint}`, 'info')
      }
    } catch (e: any) {
      addLog(`✗ Auto-fix error: ${e.message}`, 'error')
    } finally {
      setIsFixing(false)
    }
  }

  // Auto-run on mount
  useEffect(() => {
    addLog('Diagnostic tool loaded', 'info')
    addLog('Click "Run Full Diagnostic" to start', 'info')
    
    // Auto-run after 1 second
    const timer = setTimeout(() => {
      runFullDiagnostic()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const getStatusIcon = (checked: boolean, isOk: boolean) => {
    if (!checked) return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
    return isOk 
      ? <CheckCircle2 className="h-5 w-5 text-green-500" />
      : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🔐 Admin Access Diagnostic Tool</h1>
              <p className="text-violet-100">Automated testing with detailed error analysis</p>
            </div>
            <Button
              onClick={runFullDiagnostic}
              disabled={isRunning}
              variant="secondary"
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Run Full Diagnostic
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Session Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {getStatusIcon(status.checked, status.loggedIn)}
              Authentication Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Logged In:</span>
                <span className={`font-semibold ${status.loggedIn ? 'text-green-600' : 'text-red-600'}`}>
                  {status.checked ? (status.loggedIn ? 'YES' : 'NO') : 'Checking...'}
                </span>
              </div>
              {status.email && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {status.email}
                    </code>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">User ID:</span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded truncate max-w-[200px]">
                      {status.userId}
                    </code>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Admin Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {getStatusIcon(status.checked, status.isAdmin)}
              Admin Access Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Admin Access:</span>
                <span className={`font-semibold ${status.isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                  {status.checked ? (status.isAdmin ? 'GRANTED' : 'DENIED') : 'Checking...'}
                </span>
              </div>
              {status.role && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-semibold text-violet-600">{status.role}</span>
                </div>
              )}
              {autoFixSuggestion && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Fix Suggestion:</p>
                      <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">{autoFixSuggestion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {showAutoFix && status.loggedIn && !status.isAdmin && (
              <Button 
                onClick={handleAutoFix} 
                disabled={isFixing}
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Auto-Fix (Dev Only)
                  </>
                )}
              </Button>
            )}
            <Button onClick={() => router.push('/auth')} variant="default" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            <Button onClick={() => router.push('/admin/auth')} variant="default" className="gap-2">
              Go to Admin Auth
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={clearLogs} variant="outline">
              Clear Logs
            </Button>
          </div>
          {showAutoFix && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Development Mode Auto-Fix Available!</p>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Click the "Auto-Fix" button above to automatically grant yourself admin access.
                    This will add your user to the admin_users table with super_admin role.
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                    ⚠️ This feature is only available in development mode for security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Log Output */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">📋 Diagnostic Logs</h2>
          <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-8">No logs yet. Run diagnostic to start.</div>
            ) : (
              logs.map(log => (
                <div 
                  key={log.id} 
                  className={`py-1 ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}
                >
                  <span className="text-slate-500">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Help */}
        <Card className="p-6 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold mb-3">💡 What This Tool Does</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Automatically tests your authentication session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Checks if you have admin access in the database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Shows detailed error messages with fixes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Generates SQL fixes for common issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Provides actionable next steps</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
