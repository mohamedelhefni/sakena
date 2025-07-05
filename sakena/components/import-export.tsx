"use client";

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, Shield, AlertTriangle, CheckCircle, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ImportExportService } from '@/lib/import-export';
import { EncryptionService } from '@/lib/encryption';
import { User } from '@/lib/types';

interface ImportExportProps {
    user: User;
    currentPassword: string;
    onImportSuccess: () => void;
}

export function ImportExport({ user, currentPassword, onImportSuccess }: ImportExportProps) {
    const { t } = useTranslation();
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
    const [exportPassword, setExportPassword] = useState('');
    const [importPassword, setImportPassword] = useState('');
    const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showExportPassword, setShowExportPassword] = useState(false);
    const [showImportPassword, setShowImportPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [importFile, setImportFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password strength indicator component
    const PasswordStrengthIndicator = ({ password }: { password: string }) => {
        if (!password) return null;

        const strength = EncryptionService.getPasswordStrength(password);
        const strengthColors = {
            weak: 'bg-red-500',
            fair: 'bg-yellow-500',
            good: 'bg-blue-500',
            strong: 'bg-green-500'
        };

        const strengthWidths = {
            weak: 'w-1/4',
            fair: 'w-2/4',
            good: 'w-3/4',
            strong: 'w-full'
        };

        return (
            <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t('auth.passwordStrength')}</span>
                    <span className="capitalize">{t(`auth.passwordStrength${strength.charAt(0).toUpperCase() + strength.slice(1)}`)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]} ${strengthWidths[strength]}`}></div>
                </div>
            </div>
        );
    };

    const handleExport = async (encrypt: boolean = true) => {
        if (encrypt && !exportPassword) {
            setError(t('importExport.passwordRequired'));
            return;
        }

        if (encrypt && !EncryptionService.validatePin(exportPassword)) {
            setError(t('auth.passwordTooShort'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const password = encrypt ? exportPassword : currentPassword;
            const exportData = await ImportExportService.exportData(user.username, password, encrypt);
            const filename = ImportExportService.generateExportFilename(user.username, encrypt);

            ImportExportService.downloadExport(exportData, filename);
            setSuccess(t('importExport.exportSuccess'));
            setIsExportDialogOpen(false);
            setExportPassword('');
        } catch (error) {
            setError(error instanceof Error ? error.message : t('importExport.exportError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async () => {
        if (!importFile || !importPassword) {
            setError(t('importExport.fileAndPasswordRequired'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const fileContent = await ImportExportService.readFileContent(importFile);

            // Validate file first
            const validation = ImportExportService.validateImportFile(fileContent);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Attempt import - pass both import password and current auth password
            await ImportExportService.importData(
                fileContent, 
                importPassword, 
                user.username, 
                currentPassword, // current authentication password
                true
            );

            setSuccess(t('importExport.importSuccess'));
            setIsImportDialogOpen(false);
            setImportPassword('');
            setImportFile(null);
            onImportSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('importExport.importError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPasswordForChange || !newPassword || !confirmPassword) {
            setError(t('importExport.allFieldsRequired'));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t('importExport.passwordsDoNotMatch'));
            return;
        }

        if (newPassword.length < 4) {
            setError(t('auth.passwordTooShort'));
            return;
        }

        if (!EncryptionService.validatePin(newPassword)) {
            setError(t('auth.passwordTooShort'));
            return;
        }

        if (currentPasswordForChange !== currentPassword) {
            setError(t('auth.incorrectPassword'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Export data with current password
            const exportData = await ImportExportService.exportData(user.username, currentPassword, false);

            // Re-import with new password as both import and auth password
            await ImportExportService.importData(
                exportData, 
                currentPassword, // import password (current password to decrypt)
                user.username, 
                newPassword, // new auth password (to re-encrypt with)
                true
            );

            setSuccess(t('importExport.passwordChangeSuccess'));
            setIsPasswordChangeDialogOpen(false);
            setCurrentPasswordForChange('');
            setNewPassword('');
            setConfirmPassword('');

            // Trigger re-authentication with new password
            onImportSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('importExport.passwordChangeError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImportFile(file);
            setError('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('importExport.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {(error || success) && (
                    <div className={`p-3 rounded-md ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                        <div className="flex items-center">
                            {error ? (
                                <AlertTriangle className="w-4 h-4 mr-2" />
                            ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            {error || success}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        onClick={() => setIsExportDialogOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {t('importExport.exportData')}
                    </Button>

                    <Button
                        onClick={() => setIsImportDialogOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {t('importExport.importData')}
                    </Button>

                    <Button
                        onClick={() => setIsPasswordChangeDialogOpen(true)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Shield className="w-4 h-4" />
                        {t('importExport.changePassword')}
                    </Button>
                </div>

                {/* Export Dialog */}
                <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('importExport.exportData')}</DialogTitle>
                            <DialogDescription>
                                {t('importExport.exportDescription')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="export-password">{t('importExport.encryptionPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="export-password"
                                        type={showExportPassword ? "text" : "password"}
                                        value={exportPassword}
                                        onChange={(e) => setExportPassword(e.target.value)}
                                        placeholder={t('importExport.enterPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowExportPassword(!showExportPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showExportPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Info className="w-3 h-3 mr-1" />
                                    {t('auth.passwordHelp')}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {t('importExport.exportWarning')}
                            </p>
                        </div>

                        <DialogFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleExport(false)}
                                disabled={isLoading}
                                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                            >
                                {isLoading ? t('common.loading') : t('importExport.exportUnencrypted')}
                            </Button>
                            <Button onClick={() => handleExport(true)} disabled={isLoading || !exportPassword}>
                                {isLoading ? t('common.loading') : t('importExport.exportEncrypted')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Import Dialog */}
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('importExport.importData')}</DialogTitle>
                            <DialogDescription>
                                {t('importExport.importDescription')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="import-file">{t('importExport.selectFile')}</Label>
                                <Input
                                    id="import-file"
                                    type="file"
                                    accept=".json"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                {importFile && (
                                    <p className="text-sm text-muted-foreground">
                                        {t('importExport.selectedFile')}: {importFile.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="import-password">{t('importExport.decryptionPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="import-password"
                                        type={showImportPassword ? "text" : "password"}
                                        value={importPassword}
                                        onChange={(e) => setImportPassword(e.target.value)}
                                        placeholder={t('importExport.enterPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowImportPassword(!showImportPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showImportPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Info className="w-3 h-3 mr-1" />
                                    {t('importExport.importPasswordHelp')}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {t('importExport.importWarning')}
                            </p>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handleImport} disabled={isLoading || !importFile}>
                                {isLoading ? t('common.loading') : t('importExport.import')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Password Change Dialog */}
                <Dialog open={isPasswordChangeDialogOpen} onOpenChange={setIsPasswordChangeDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('importExport.changePassword')}</DialogTitle>
                            <DialogDescription>
                                {t('importExport.changePasswordDescription')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">{t('importExport.currentPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPasswordForChange}
                                        onChange={(e) => setCurrentPasswordForChange(e.target.value)}
                                        placeholder={t('importExport.enterCurrentPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">{t('importExport.newPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('importExport.enterNewPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <PasswordStrengthIndicator password={newPassword} />
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Info className="w-3 h-3 mr-1" />
                                    {t('auth.passwordHelp')}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">{t('importExport.confirmPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t('importExport.confirmNewPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPasswordChangeDialogOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={handlePasswordChange} disabled={isLoading}>
                                {isLoading ? t('common.loading') : t('importExport.changePassword')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
