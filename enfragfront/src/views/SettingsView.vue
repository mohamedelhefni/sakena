<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
        <div class="max-w-4xl mx-auto p-6">
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">الإعدادات</h1>
                <div class="space-y-6">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800 mb-3">تغيير رقم PIN</h2>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            تغيير رقم PIN
                        </button>
                    </div>

                    <div>
                        <h2 class="text-lg font-semibold text-gray-800 mb-3">إدارة البيانات</h2>
                        <div class="space-y-3">
                            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                                تصدير البيانات
                            </button>
                            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                                حذف جميع البيانات
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
