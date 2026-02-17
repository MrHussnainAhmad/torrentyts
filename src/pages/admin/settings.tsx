import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/form-elements';
import { Settings, Save, User, Shield, Bell, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSettings() {
    const { data: settingsData, error } = useSWR('/api/settings', fetcher);
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        siteName: '',
        siteDescription: '',
        footerText: '',
        contactEmail: '',
        defaultQuality: '',
        defaultLanguage: '',
    });

    useEffect(() => {
        if (settingsData?.success && settingsData.data) {
            setFormData(settingsData.data);
        }
    }, [settingsData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (result.success) {
                mutate('/api/settings');
                alert('Settings saved successfully!');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {

            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (error) return <AdminLayout><div>Failed to load settings</div></AdminLayout>;
    if (!settingsData) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-8 h-8 text-[#6AC045]" />
                        System Settings
                    </h1>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Nav Settings */}
                    <div className="md:col-span-1 space-y-1">
                        {[
                            { id: 'general', label: 'General', icon: Settings },
                            { id: 'account', label: 'Account', icon: User },
                            { id: 'security', label: 'Security', icon: Shield },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors",
                                    activeTab === tab.id
                                        ? "bg-[#6AC045]/10 text-[#6AC045]"
                                        : "text-slate-400 hover:bg-dark-surface hover:text-white"
                                )}
                            >
                                <tab.icon className="w-5 h-5" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Settings Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-white">General Settings</CardTitle>
                                        <CardDescription className="text-slate-500">
                                            Configure basic site information and SEO settings.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="siteName">Site Name</Label>
                                            <Input id="siteName" value={formData.siteName} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siteDescription">Site Description</Label>
                                            <Textarea
                                                id="siteDescription"
                                                value={formData.siteDescription}
                                                onChange={handleInputChange}
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="footerText">Footer Text</Label>
                                            <Input id="footerText" value={formData.footerText} onChange={handleInputChange} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-white">Torrent Configuration</CardTitle>
                                        <CardDescription className="text-slate-500">
                                            Default settings for torrent metadata.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="defaultQuality">Default Quality</Label>
                                                <Input id="defaultQuality" value={formData.defaultQuality} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="defaultLanguage">Default Language</Label>
                                                <Input id="defaultLanguage" value={formData.defaultLanguage} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-white">Account Settings</CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Manage your administrator account details.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail">Admin Contact Email</Label>
                                        <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} />
                                    </div>
                                    <div className="pt-4 border-t border-dark-border">
                                        <p className="text-sm text-slate-500 mb-4 font-mono">Role: SUPER_ADMIN</p>
                                        <Button variant="outline" className="text-red-400 border-red-400/20 hover:bg-red-400/10">Request Role Change</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-white">Security Settings</CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Configure authentication and access controls.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                                        <div>
                                            <p className="font-medium text-white">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                                        </div>
                                        <Button variant="outline" size="sm">Enable</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                                        <div>
                                            <p className="font-medium text-white">Session Management</p>
                                            <p className="text-sm text-slate-500">Manage your active sessions and logout from other devices.</p>
                                        </div>
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-red-400/5 rounded-lg border border-red-400/10">
                                        <div>
                                            <p className="font-medium text-red-400">Restricted Access</p>
                                            <p className="text-sm text-slate-500">Enable IP-based restrictions for the admin panel.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="text-red-400">Configure</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-white">Notification Settings</CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Choose what notifications you want to receive.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { title: 'System Emails', desc: 'Receive emails about system updates and health.', checked: true },
                                            { title: 'Course Activity', desc: 'Get notified when new courses are published or updated.', checked: false },
                                            { title: 'User Reports', desc: 'Receive notifications about broken links or DMCA reports.', checked: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start justify-between">
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium text-white">{item.title}</p>
                                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" checked={item.checked} className="w-4 h-4 rounded border-dark-border bg-dark-bg text-[#6AC045] focus:ring-[#6AC045]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-dark-border">
                                        <Button variant="outline">Configure Webhooks</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
