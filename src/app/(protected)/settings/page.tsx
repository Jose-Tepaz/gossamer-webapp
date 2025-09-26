"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Zap
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePlanSelection, PlanType } from "@/hooks/usePlanSelection"

export default function SettingsPage() {
  const { user } = useAuth()
  const { selectPlan, loading: planLoading, error: planError } = usePlanSelection()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: ""
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    portfolioUpdates: true,
    marketAlerts: false,
    weeklyReports: true
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "24h",
    loginNotifications: true
  })

  const [preferences, setPreferences] = useState({
    currency: "USD",
    timezone: "UTC",
    language: "English",
    theme: "light"
  })



  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Settings saved")
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    // Simulate data export
    console.log("Exporting data...")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account...")
    }
  }

  const handlePlanSelect = async (planType: PlanType) => {
    try {
      console.log('🔄 Seleccionando plan desde settings:', planType)
      
      const result = await selectPlan(planType)
      
      if (result.success) {
        console.log('✅ Plan seleccionado exitosamente:', planType)
        // Aquí podrías mostrar una notificación de éxito
      } else {
        console.error('❌ Error seleccionando plan:', result.error)
        // El error ya se maneja en el hook usePlanSelection
      }
    } catch (error) {
      console.error('❌ Error inesperado seleccionando plan:', error)
    }
  }

  return (
    <div>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 border-b mb-6">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  onClick={() => setActiveTab("profile")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  onClick={() => setActiveTab("notifications")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  onClick={() => setActiveTab("security")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
                <Button
                  variant={activeTab === "preferences" ? "default" : "ghost"}
                  onClick={() => setActiveTab("preferences")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Preferences
                </Button>
                <Button
                  variant={activeTab === "plans" ? "default" : "ghost"}
                  onClick={() => setActiveTab("plans")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Plans
                </Button>
              </div>

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailAlerts: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get real-time notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Portfolio Updates</Label>
                        <p className="text-sm text-muted-foreground">Notifications about portfolio changes</p>
                      </div>
                      <Switch
                        checked={notifications.portfolioUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, portfolioUpdates: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Market Alerts</Label>
                        <p className="text-sm text-muted-foreground">Breaking market news and alerts</p>
                      </div>
                      <Switch
                        checked={notifications.marketAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketAlerts: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly portfolio performance summaries</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={security.twoFactorAuth}
                        onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                      </div>
                      <Switch
                        checked={security.loginNotifications}
                        onCheckedChange={(checked) => setSecurity({...security, loginNotifications: checked})}
                      />
                    </div>
                    <Separator />
                    <div>
                      <Label>Session Timeout</Label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="1h">1 hour</option>
                        <option value="8h">8 hours</option>
                        <option value="24h">24 hours</option>
                        <option value="7d">7 days</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Currency</Label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">GMT</option>
                      </select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div>
                      <Label>Theme</Label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Plans Tab */}
              {activeTab === "plans" && (
                <div className="space-y-6">
                  {/* Current Plan Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{user?.planType || 'Free'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.planType === 'Free' ? 'Basic features included' : 
                             user?.planType === 'Pro' ? 'Advanced features and analytics' : 
                             'Premium features with AI insights'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">
                            {user?.planType === 'Free' ? '$0' : 
                             user?.planType === 'Pro' ? '$24' : '$49'}
                          </span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Error Message */}
                  {planError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="text-sm text-red-600">{planError}</div>
                    </div>
                  )}

                  {/* Loading Indicator */}
                  {planLoading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="text-sm text-blue-600">Procesando selección de plan...</div>
                    </div>
                  )}

                  {/* Available Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free Plan */}
                    <Card className={`relative ${user?.planType === 'Free' ? 'ring-2 ring-green-500' : ''}`}>
                      {user?.planType === 'Free' && (
                        <div className="absolute -top-2 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                          Current Plan
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="grid place-items-center size-8 rounded-md bg-gray-100">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-lg">Free</CardTitle>
                        </div>
                        <div className="mt-1">
                          <span className="text-3xl font-semibold">$0</span>
                          <span className="text-muted-foreground">/mo</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Basic portfolio tracking</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Up to 3 model portfolios</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Standard support</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Basic analytics</span>
                          </li>
                        </ul>
                        <Button
                          className="w-full"
                          variant={user?.planType === 'Free' ? "outline" : "default"}
                          onClick={() => handlePlanSelect("Free")}
                          disabled={planLoading || user?.planType === 'Free'}
                        >
                          {user?.planType === 'Free' ? 'Current Plan' : 'Select Free'}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Pro Plan */}
                    <Card className={`relative ${user?.planType === 'Pro' ? 'ring-2 ring-blue-500' : ''}`}>
                      {user?.planType === 'Pro' && (
                        <div className="absolute -top-2 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                          Current Plan
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="grid place-items-center size-8 rounded-md bg-blue-100">
                            <Shield className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-lg">Pro</CardTitle>
                        </div>
                        <div className="mt-1">
                          <span className="text-3xl font-semibold">$24</span>
                          <span className="text-muted-foreground">/mo</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Everything in Free</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Unlimited model portfolios</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Custom alerts</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>API access</span>
                          </li>
                        </ul>
                        <Button
                          className="w-full"
                          variant={user?.planType === 'Pro' ? "outline" : "default"}
                          onClick={() => handlePlanSelect("Pro")}
                          disabled={planLoading || user?.planType === 'Pro'}
                        >
                          {user?.planType === 'Pro' ? 'Current Plan' : 'Select Pro'}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Premium Plan */}
                    <Card className={`relative ${user?.planType === 'Premium' ? 'ring-2 ring-purple-500' : ''}`}>
                      {user?.planType === 'Premium' && (
                        <div className="absolute -top-2 left-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                          Current Plan
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="grid place-items-center size-8 rounded-md bg-purple-100">
                            <Zap className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-lg">Premium</CardTitle>
                        </div>
                        <div className="mt-1">
                          <span className="text-3xl font-semibold">$49</span>
                          <span className="text-muted-foreground">/mo</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Everything in Pro</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>AI-powered insights</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Portfolio optimization</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Dedicated account manager</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Custom integrations</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>White-label options</span>
                          </li>
                        </ul>
                        <Button
                          className="w-full"
                          variant={user?.planType === 'Premium' ? "outline" : "default"}
                          onClick={() => handlePlanSelect("Premium")}
                          disabled={planLoading || user?.planType === 'Premium'}
                        >
                          {user?.planType === 'Premium' ? 'Current Plan' : 'Select Premium'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={handleDeleteAccount} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
    </div>
  )
}
