-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerWhatsapp" TEXT,
ADD COLUMN     "panelOrderId" TEXT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "packageType" TEXT NOT NULL DEFAULT 'brasileiros',
ADD COLUMN     "platform" TEXT NOT NULL DEFAULT 'instagram',
ADD COLUMN     "providerServiceId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'visualizacoes';

-- AlterTable
ALTER TABLE "SystemSetting" ADD COLUMN     "fbApiToken" TEXT,
ADD COLUMN     "fbPixelId" TEXT,
ADD COLUMN     "perfectPanelKey" TEXT,
ADD COLUMN     "perfectPanelUrl" TEXT,
ADD COLUMN     "pushinpayToken" TEXT,
ADD COLUMN     "pushinpayWebhookToken" TEXT,
ADD COLUMN     "rapidApiKey" TEXT,
ADD COLUMN     "showNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "whatsappNumber" TEXT;
