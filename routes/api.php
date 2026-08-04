<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PromoCodeController;
use App\Http\Controllers\Api\ChefController;
use App\Http\Controllers\Api\GeographyController;
use App\Http\Controllers\Api\StoreOnboardingController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\OwnerFoodController;
use App\Http\Controllers\Api\OwnerDashboardController;
use App\Http\Controllers\Api\OwnerOfferController;
use App\Http\Controllers\Api\OwnerOrderController;
use App\Http\Controllers\Api\OwnerSalesController;
use App\Http\Controllers\Api\OwnerSettingsController;
use App\Http\Controllers\Api\OwnerStaffController;
use App\Http\Controllers\Api\OwnerDomainController;
use App\Http\Controllers\Api\OwnerGalleryController;
use App\Http\Controllers\Api\OwnerChefController;
use App\Http\Controllers\Api\ClientOrderController;
use App\Http\Controllers\Api\ClientReservationController;
use App\Http\Controllers\Api\OwnerReservationController;
use App\Http\Controllers\Api\OwnerClientController;
use App\Http\Controllers\Api\ClientChefController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminStoreController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminBadgeController;
use App\Http\Controllers\Api\Admin\AdminChefController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminComplaintController;
use App\Http\Controllers\Api\Admin\AdminReservationController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminStoreTypeController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminPayoutController;
use App\Http\Controllers\Api\Admin\AdminDomainController;
use App\Http\Controllers\Api\Admin\AdminPromoCodeController;
use App\Http\Controllers\Api\Admin\AdminBannerController;
use App\Http\Controllers\Api\Admin\AdminFoodController;
use App\Http\Controllers\Api\AuthPasswordController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\KdsOrderController;
use App\Http\Controllers\Api\PublicStorePageController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\PublicTemplateController;
use App\Http\Controllers\Api\BranchTemplateController;
use App\Http\Controllers\Api\Admin\AdminTemplateController;
use App\Http\Controllers\Api\Admin\AdminTemplateBlockController;
use App\Http\Controllers\Api\Admin\AdminThemePresetController;
use App\Http\Controllers\Api\OwnerSavedSectionController;
use App\Http\Controllers\Api\OwnerSubscriptionController;
use App\Http\Controllers\Api\DeliveryPricingController;
use App\Http\Controllers\Api\Admin\AdminPlanController;
use App\Http\Controllers\Api\Admin\AdminPlanFeatureController;
use App\Http\Controllers\Api\Admin\AdminPlanTierController;
use App\Http\Controllers\Api\Admin\AdminDurationOfferController;
use App\Http\Controllers\Api\Admin\AdminDeliveryPricingController;
use App\Http\Controllers\Api\Admin\AdminPaymentGatewayController;
use App\Http\Controllers\Api\Admin\AdminBillingController;
use App\Http\Controllers\Api\PhoneVerificationController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\BranchPageController;
use App\Http\Controllers\Api\PublicBranchController;
use App\Http\Controllers\Api\StoreBranchRelationshipController;

// ============================================================================
// Health Check (no auth, no version prefix)
// ============================================================================
Route::get('/health', HealthController::class);

// ============================================================================
// API v1
// ============================================================================
Route::prefix('v1')->group(function () {

    // ── Public: Auth ─────────────────────────────────────────────────────────
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
    });

    // Named route so Laravel auth middleware returns JSON instead of crashing
    Route::get('/login', fn () => response()->json(['message' => 'Unauthenticated.'], 401))->name('login');

    // ── Public: Password Reset ────────────────────────────────────────────────
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/forgot-password', [AuthPasswordController::class, 'forgotPassword']);
        Route::post('/reset-password',  [AuthPasswordController::class, 'resetPassword']);
    });

    // ── Public: Categories (cached) ───────────────────────────────────────────
    Route::get('/categories', [CategoryController::class, 'index'])->middleware('throttle:public-api');

    // ── Public: Feature Flags (cached) ──────────────────────────────────────────
    Route::get('/features', FeatureController::class)->middleware('throttle:public-api');

    // ── Public: Stores ────────────────────────────────────────────────────────
    Route::middleware('throttle:public-api')->group(function () {
        Route::get('/stores',                [StoreController::class, 'index']);
        Route::get('/stores/{alias}',        [StoreController::class, 'show']);
        Route::get('/stores/{alias}/foods',  [StoreController::class, 'foods']);
        Route::get('/stores/{alias}/reviews',[ReviewController::class, 'index']);
        Route::get('/stores/{alias}/page',   [PublicStorePageController::class, 'show']);
        Route::get('/stores/{alias}/page/{slug}', [PublicStorePageController::class, 'showPage'])->where('slug', '[a-z0-9-]+');
        Route::get('/stores/{alias}/reservations/settings', [ClientReservationController::class, 'settings']);
        Route::get('/stores/{alias}/banners',  [BannerController::class, 'storeBanners']);
        Route::get('/banners/active',         [BannerController::class, 'active']);
        Route::get('/search',                [StoreController::class, 'search'])->middleware('throttle:search');
        Route::get('/resolve-domain',        [OwnerDomainController::class, 'resolve']);

        // ── Public: Branches ─────────────────────────────────────────────────────
        Route::get('/stores/{storeAlias}/branches',         [PublicBranchController::class, 'branchesByStore']);
        Route::get('/branches/{alias}',                     [PublicBranchController::class, 'show']);
        Route::get('/branches/{alias}/page',                [PublicBranchController::class, 'show']);
        Route::get('/branches/{alias}/page/{slug}',         [PublicBranchController::class, 'showPage'])->where('slug', '[a-z0-9-]+');
        Route::get('/branches/{alias}/block/{blockType}',   [PublicBranchController::class, 'blockData']);
    });

    // ── Public: Chefs ─────────────────────────────────────────────────────────
    Route::middleware('throttle:public-api')->group(function () {
        Route::get('/chefs',      [ChefController::class, 'index']);
        Route::get('/chefs/{id}', [ChefController::class, 'show']);
    });

    // ── Public: Geography ────────────────────────────────────────────────────
    Route::middleware('throttle:public-api')->group(function () {
        Route::get('/geo/wilayas', [GeographyController::class, 'wilayas']);
        Route::get('/geo/wilayas/{id}/dairas', [GeographyController::class, 'dairas'])->whereNumber('id');
        Route::get('/geo/dairas/{id}/communes', [GeographyController::class, 'communes'])->whereNumber('id');
        Route::get('/geo/cities', [GeographyController::class, 'cities']);
    });

    // ── Public: Templates (for store owner template selector) ─────────────────
    Route::middleware('throttle:public-api')->group(function () {
        Route::get('/templates',           [PublicTemplateController::class, 'listActive']);
        Route::get('/templates/{slug}',    [PublicTemplateController::class, 'show']);
        Route::get('/templates/{slug}/presets', [PublicTemplateController::class, 'getPresets']);
    });

    // ── Authenticated ──────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);

        // User profile
        Route::get('/user',                          [UserController::class, 'show']);
        Route::put('/user',                          [UserController::class, 'update']);
        Route::post('/user/avatar',                  [UserController::class, 'updateAvatar']);
        Route::post('/user/password',                [UserController::class, 'changePassword']);
        Route::get('/user/notifications',            [UserController::class, 'notifications']);
        Route::post('/user/notifications/read',      [UserController::class, 'markNotificationsRead']);

        // Phone Verification
        Route::prefix('phone')->group(function () {
            Route::get('/',                          [PhoneVerificationController::class, 'getPhones']);
            Route::post('/send-code',                [PhoneVerificationController::class, 'sendCode'])->middleware('throttle:otp');
            Route::post('/verify',                   [PhoneVerificationController::class, 'verify'])->middleware('throttle:otp');
            Route::post('/add',                      [PhoneVerificationController::class, 'addPhone']);
            Route::delete('/{storePhone}',           [PhoneVerificationController::class, 'removePhone']);
            Route::post('/{storePhone}/set-primary', [PhoneVerificationController::class, 'setPrimary']);
        });

        // Store Onboarding
        Route::prefix('onboarding')->group(function () {
            Route::get('/status',             [StoreOnboardingController::class, 'getStatus']);
            Route::get('/store-types',         [StoreOnboardingController::class, 'getStoreTypes']);
            Route::post('/basic-info',        [StoreOnboardingController::class, 'saveBasicInfo']);
            Route::post('/store-types',        [StoreOnboardingController::class, 'saveStoreTypes']);
            Route::post('/location',           [StoreOnboardingController::class, 'saveLocation']);
            Route::post('/social-links',       [StoreOnboardingController::class, 'saveSocialLinks']);
            Route::post('/break-settings',     [StoreOnboardingController::class, 'saveBreakSettings']);
            Route::post('/complete',           [StoreOnboardingController::class, 'completeOnboarding']);
        });

        // Client: Chef profile management
        Route::prefix('client/chef')->group(function () {
            Route::get('/',                   [ClientChefController::class, 'show']);
            Route::post('/',                  [ClientChefController::class, 'update']);
            Route::post('/document',          [ClientChefController::class, 'uploadDocument']);
            Route::get('/stores',             [ClientChefController::class, 'stores']);
        });

        // Client: Create store
        Route::post('/client/store', [StoreController::class, 'createStore']);

        // ── Owner: Branches ──────────────────────────────────────────────────────
        Route::prefix('stores/{store}/branches')->group(function () {
            // index moved to store.owner group below to avoid public route shadowing
            Route::post('/',                       [BranchController::class, 'store']);
        });
        Route::prefix('branches/{branch}')->group(function () {
            // show moved to store.owner group below to avoid public route shadowing
            Route::put('/',                        [BranchController::class, 'update']);
            Route::delete('/',                     [BranchController::class, 'destroy']);
            Route::put('/template',                [BranchController::class, 'updateTemplate']);
            Route::post('/assign-user',            [BranchController::class, 'assignUser']);
            Route::delete('/users/{user}',         [BranchController::class, 'removeUser']);
            Route::post('/duplicate-template',     [BranchController::class, 'duplicateTemplate']);
            // New BranchTemplate endpoints
            Route::get('/template', [BranchTemplateController::class, 'show']);
            Route::post('/template', [BranchTemplateController::class, 'store']);
            Route::put('/template/sync', [BranchTemplateController::class, 'updateSync']);
            Route::delete('/template', [BranchTemplateController::class, 'destroy']);
            Route::post('/template/clone', [BranchTemplateController::class, 'clone']);
            Route::get('/template/export', [BranchTemplateController::class, 'export']);
            Route::post('/template/import', [BranchTemplateController::class, 'import']);
            
            // Branch relationship endpoints
            Route::post('/inherit-from-parent', [BranchController::class, 'inheritFromParent']);
            Route::post('/link-to-branch', [BranchController::class, 'linkToBranch']);
            
            // Branch customization endpoints
            Route::get('/customization-status', [BranchController::class, 'getCustomizationStatus']);
            Route::post('/reset-to-source', [BranchController::class, 'resetToSource']);
            Route::put('/template/blocks', [BranchController::class, 'updateTemplateBlocks']);
            Route::put('/template/theme-variables', [BranchController::class, 'updateThemeVariables']);
            Route::put('/template/content', [BranchController::class, 'updateTemplateContent']);
        });
        
        // Store branch relationships management
        Route::prefix('stores/{store}/branch-relationships')->group(function () {
            Route::get('/', [StoreBranchRelationshipController::class, 'index']);
            Route::post('/set-main-branch', [StoreBranchRelationshipController::class, 'setMainBranch']);
        });

        // ── Owner: Branch Pages (page builder) ────────────────────────────────────
        Route::prefix('branches/{branch}/page')->group(function () {
            Route::get('/',                 [BranchPageController::class, 'show']);
            Route::put('/',                 [BranchPageController::class, 'save']);
            Route::delete('/',              [BranchPageController::class, 'delete']);
            Route::get('/versions',         [BranchPageController::class, 'versions']);
            Route::post('/restore',         [BranchPageController::class, 'restore']);
        });
        Route::prefix('branches/{branch}/pages')->group(function () {
            Route::get('/',                             [BranchPageController::class, 'list']);
            Route::post('/',                            [BranchPageController::class, 'create']);
            Route::post('/copy-from/{sourceBranch}',    [BranchPageController::class, 'copyPages']);
            Route::get('/{slug}',                       [BranchPageController::class, 'showSlug'])->where('slug', '[a-z0-9-]+');
            Route::put('/{slug}',                       [BranchPageController::class, 'saveSlug'])->where('slug', '[a-z0-9-]+');
            Route::delete('/{slug}',                    [BranchPageController::class, 'deleteSlug'])->where('slug', '[a-z0-9-]+');
            Route::get('/{slug}/versions',              [BranchPageController::class, 'versions'])->where('slug', '[a-z0-9-]+');
            Route::post('/{slug}/restore',              [BranchPageController::class, 'restore'])->where('slug', '[a-z0-9-]+');
        });

        // ── Owner: Store info & template selection ─────────────────────────
        Route::middleware('store.owner')->group(function () {
            Route::get('/owner/store',             [StoreController::class, 'showOwner']);
            Route::put('/owner/store/template',    [StoreController::class, 'updateTemplate']);

            // ── Owner: Branches (owner-only GET routes) ───────────────────────
            Route::get('/owner/stores/{store}/branches', [BranchController::class, 'index']);
            Route::get('/owner/branches/{branch}',       [BranchController::class, 'show']);

            // ── Owner: Foods CRUD ──────────────────────────────────────────────────
            Route::prefix('owner/foods')->group(function () {
                Route::get('/',                    [OwnerFoodController::class, 'index']);
                Route::get('/categories',          [OwnerFoodController::class, 'categories']);
                Route::post('/',                   [OwnerFoodController::class, 'store']);
                Route::get('/{id}',                [OwnerFoodController::class, 'show']);
                Route::put('/{id}',                [OwnerFoodController::class, 'update']);
                Route::delete('/{id}',             [OwnerFoodController::class, 'destroy']);
                Route::post('/{id}/image',         [OwnerFoodController::class, 'uploadImage']);
                Route::post('/{id}/today-special', [OwnerFoodController::class, 'setTodaySpecial']);
                Route::delete('/{id}/today-special', [OwnerFoodController::class, 'unsetTodaySpecial']);
                Route::get('/today-special',       [OwnerFoodController::class, 'getTodaySpecialFoods']);
            });

            // ── Owner: Custom Pages (file-based, multi-page) ─────────────────────
            Route::prefix('owner/page')->group(function () {
                Route::get('/',                 [PageController::class, 'show']);
                Route::put('/',                 [PageController::class, 'save']);
                Route::delete('/',              [PageController::class, 'delete']);
                Route::get('/versions',         [PageController::class, 'versions']);
                Route::post('/restore',         [PageController::class, 'restore']);
            });

            // ── Owner: Multi-page management ──────────────────────────────────────
            Route::prefix('owner/pages')->group(function () {
                Route::get('/',                 [PageController::class, 'list']);
                Route::post('/',                [PageController::class, 'create']);
                Route::get('/{slug}',           [PageController::class, 'showSlug'])->where('slug', '[a-z0-9-]+');
                Route::put('/{slug}',           [PageController::class, 'saveSlug'])->where('slug', '[a-z0-9-]+');
                Route::delete('/{slug}',        [PageController::class, 'deleteSlug'])->where('slug', '[a-z0-9-]+');
                Route::get('/{slug}/versions',  [PageController::class, 'versions'])->where('slug', '[a-z0-9-]+');
                Route::post('/{slug}/restore',  [PageController::class, 'restore'])->where('slug', '[a-z0-9-]+');
            });

            // ── Owner: Staff management ──────────────────────────────────────────
            Route::prefix('owner/staff')->group(function () {
                Route::get('/',                 [OwnerStaffController::class, 'index']);
                Route::post('/',                [OwnerStaffController::class, 'store']);
                Route::put('/{id}',             [OwnerStaffController::class, 'update']);
                Route::delete('/{id}',          [OwnerStaffController::class, 'destroy']);
            });

            // ── Owner: Offers ────────────────────────────────────────────────────
            Route::prefix('owner/offers')->group(function () {
                Route::get('/',                 [OwnerOfferController::class, 'index']);
                Route::post('/',                [OwnerOfferController::class, 'store']);
                Route::get('/{id}',             [OwnerOfferController::class, 'show']);
                Route::put('/{id}',             [OwnerOfferController::class, 'update']);
                Route::delete('/{id}',          [OwnerOfferController::class, 'destroy']);
                Route::post('/{id}/image',      [OwnerOfferController::class, 'uploadImage']);
            });

            // ── Owner: Saved Sections ─────────────────────────────────────────────
            Route::prefix('owner/saved-sections')->group(function () {
                Route::get('/',                 [OwnerSavedSectionController::class, 'index']);
                Route::post('/',                [OwnerSavedSectionController::class, 'store']);
                Route::put('/{id}',             [OwnerSavedSectionController::class, 'update']);
                Route::delete('/{id}',          [OwnerSavedSectionController::class, 'destroy']);
            });

            // ── Owner: Dashboard ────────────────────────────────────────────────
            Route::get('/owner/dashboard',          [OwnerDashboardController::class, 'index']);

            // ── Owner: Orders ────────────────────────────────────────────────────
            Route::prefix('owner')->group(function () {
                Route::get('/riders',               [OwnerOrderController::class, 'riders']);
                Route::post('/riders/{userId}/favorite', [OwnerOrderController::class, 'toggleFavoriteRider']);
                Route::prefix('orders')->group(function () {
                    Route::get('/',                 [OwnerOrderController::class, 'index']);
                    Route::get('/{id}',             [OwnerOrderController::class, 'show']);
                    Route::put('/{id}/status', [OwnerOrderController::class, 'updateStatus']);
                    Route::post('/bulk/status',     [OwnerOrderController::class, 'bulkStatus']);
                    Route::post('/bulk/assign',     [OwnerOrderController::class, 'bulkAssign']);
                    Route::delete('/bulk',          [OwnerOrderController::class, 'bulkDelete']);
                    Route::post('/{id}/assign',     [OwnerOrderController::class, 'assign']);
                });
            });

            // ── Owner: Sales ─────────────────────────────────────────────────────
            Route::prefix('owner/sales')->group(function () {
                Route::get('/',                 [OwnerSalesController::class, 'index']);
                Route::get('/stats',            [OwnerSalesController::class, 'stats']);
                Route::get('/monthly',          [OwnerSalesController::class, 'monthly']);
                Route::get('/yearly',           [OwnerSalesController::class, 'yearly']);
            });

            // ── Owner: Gallery ───────────────────────────────────────────────────
            Route::prefix('owner/gallery')->group(function () {
                Route::get('/',                 [OwnerGalleryController::class, 'index']);
                Route::post('/',                [OwnerGalleryController::class, 'store']);
                Route::delete('/{id}',          [OwnerGalleryController::class, 'destroy']);
            });

            // ── Owner: Reservations ───────────────────────────────────────────────
            Route::prefix('owner/reservations')->group(function () {
                Route::get('/',                 [OwnerReservationController::class, 'index']);
                Route::get('/settings',         [OwnerReservationController::class, 'settings']);
                Route::put('/settings',         [OwnerReservationController::class, 'updateSettings']);
                Route::put('/schedules',        [OwnerReservationController::class, 'updateSchedules']);
                Route::get('/{id}',             [OwnerReservationController::class, 'show']);
                Route::put('/{id}/status',      [OwnerReservationController::class, 'updateStatus']);
            });

            // ── Owner: Chefs ─────────────────────────────────────────────────────
            Route::prefix('owner/chefs')->group(function () {
                Route::get('/',                 [OwnerChefController::class, 'index']);
                Route::get('/hired',            [OwnerChefController::class, 'hired']);
                Route::post('/{id}/hire',       [OwnerChefController::class, 'hire']);
                Route::post('/{id}/fire',       [OwnerChefController::class, 'fire']);
            });

            // ── Owner: Settings ──────────────────────────────────────────────────
            Route::prefix('owner/settings')->group(function () {
                Route::get('/',                 [OwnerSettingsController::class, 'index']);
                Route::put('/',                 [OwnerSettingsController::class, 'update']);
                Route::post('/logo',            [OwnerSettingsController::class, 'uploadLogo']);
                Route::post('/cover',           [OwnerSettingsController::class, 'uploadCover']);
                Route::post('/pause',           [OwnerSettingsController::class, 'togglePause']);
            });

            // ── Owner: Client management (ban, report, trust scores) ────────────
            Route::prefix('owner/clients')->group(function () {
                Route::get('/',                     [OwnerClientController::class, 'index']);
                Route::post('/{clientId}/ban',      [OwnerClientController::class, 'ban']);
                Route::post('/{clientId}/unban',    [OwnerClientController::class, 'unban']);
                Route::post('/{clientId}/report',   [OwnerClientController::class, 'report']);
                Route::get('/{clientId}/trust',     [OwnerClientController::class, 'trustScore']);
            });

            // ── Owner: Media assets ───────────────────────────────────────────────
            Route::prefix('owner/assets')->group(function () {
                Route::get('/',                 [AssetController::class, 'index']);
                Route::post('/',                [AssetController::class, 'store']);
                Route::delete('/{asset}',       [AssetController::class, 'destroy']);
            });

            // ── Owner: Custom Domains ──────────────────────────────────────────────
            Route::prefix('owner/domains')->group(function () {
                Route::get('/',                     [OwnerDomainController::class, 'index']);
                Route::post('/',                    [OwnerDomainController::class, 'store']);
                Route::post('/{storeDomain}/verify', [OwnerDomainController::class, 'verify']);
                Route::post('/{storeDomain}/primary',[OwnerDomainController::class, 'setPrimary']);
                Route::delete('/{storeDomain}',      [OwnerDomainController::class, 'destroy']);
            });

            // ── Owner: Subscription & Billing ─────────────────────────────────────
            Route::prefix('owner/subscription')->group(function () {
                Route::get('/',                          [OwnerSubscriptionController::class, 'show']);
                Route::get('/plans',                     [OwnerSubscriptionController::class, 'plans']);
                Route::post('/change',                   [OwnerSubscriptionController::class, 'change']);
                Route::get('/invoices',                  [OwnerSubscriptionController::class, 'invoices']);
                Route::post('/payment-method',           [OwnerSubscriptionController::class, 'savePaymentMethod']);
                Route::post('/pay-invoice/{billingInvoice}', [OwnerSubscriptionController::class, 'payInvoice']);
            });
        });

        // Orders
        Route::middleware('throttle:orders')->group(function () {
            Route::post('/orders', [OrderController::class, 'store']);
        });
        Route::get('/orders/{id}',             [OrderController::class, 'show']);
        Route::post('/orders/{id}/status',     [OrderController::class, 'updateStatus']);

        // Reviews (write)
        Route::post('/stores/{alias}/reviews', [ReviewController::class, 'store']);
        Route::delete('/reviews/{id}',         [ReviewController::class, 'destroy']);

        // Promo codes
        Route::post('/promo/validate',         [PromoCodeController::class, 'validate']);

        // Client orders
        Route::prefix('client')->group(function () {
            Route::get('/orders',              [ClientOrderController::class, 'listOrders']);
            Route::get('/orders/{id}',         [ClientOrderController::class, 'showOrder']);
            Route::post('/orders',             [ClientOrderController::class, 'placeOrder']);
            Route::post('/orders/{id}/reorder',   [ClientOrderController::class, 'reorder']);
            Route::post('/orders/{id}/complaint', [ClientOrderController::class, 'submitComplaint']);
            Route::post('/cart/add',           [ClientOrderController::class, 'addToCart']);
            Route::post('/cart/update',        [ClientOrderController::class, 'updateQuantity']);
            Route::post('/cart/remove',        [ClientOrderController::class, 'removeFromCart']);
            Route::post('/cart/clear',         [ClientOrderController::class, 'clearCart']);
            Route::get('/cart',                [ClientOrderController::class, 'getCart']);
        });

        // Client reservations
        Route::post('/stores/{alias}/reservations/check', [ClientReservationController::class, 'checkAvailability']);
        Route::post('/stores/{alias}/reservations', [ClientReservationController::class, 'store']);
        Route::get('/client/reservations', [ClientReservationController::class, 'index']);
        Route::delete('/client/reservations/{id}', [ClientReservationController::class, 'destroy']);

        // Complaints
        Route::post('/complaints',             [ComplaintController::class, 'store']);

        // Desktop POS sync
        Route::prefix('pos')->middleware('store.owner')->group(function () {
            Route::get('/orders',                  [OrderController::class, 'posOrders']);
            Route::post('/orders/{id}/status',     [OrderController::class, 'updateStatus']);
        });

        // Delivery
        Route::prefix('delivery')->middleware('delivery')->group(function () {
            Route::get('/stats',                   [DeliveryController::class, 'stats']);
            Route::get('/pending',                 [DeliveryController::class, 'pendingOrders']);
            Route::get('/active',                  [DeliveryController::class, 'activeOrders']);
            Route::post('/orders/{id}/accept',     [DeliveryController::class, 'acceptOrder']);
            Route::post('/orders/{id}/complete',   [DeliveryController::class, 'completeOrder']);
            Route::post('/status',                 [DeliveryController::class, 'toggleStatus']);
            Route::get('/areas',                   [DeliveryController::class, 'getAreas']);
            Route::post('/areas',                  [DeliveryController::class, 'saveAreas']);
            Route::post('/pricing',                [DeliveryController::class, 'updatePricing']);

            // Delivery Pricing & Subscriptions
            Route::get('/pricing',                      [DeliveryPricingController::class, 'show']);
            Route::get('/pricing/tiers',                [DeliveryPricingController::class, 'tiers']);
            Route::post('/pricing/choose-model',        [DeliveryPricingController::class, 'chooseModel']);
            Route::post('/pricing/subscribe',           [DeliveryPricingController::class, 'subscribe']);
            Route::get('/pricing/earnings',             [DeliveryPricingController::class, 'earnings']);
            Route::get('/pricing/earnings/history',     [DeliveryPricingController::class, 'earningsHistory']);
        });

        // Delivery rider location update (rate-limited)
        Route::middleware('throttle:public-api')->group(function () {
            Route::post('/delivery/location', [DeliveryController::class, 'updateLocation']);
        });

        // ── KDS (Kitchen Display) ─────────────────────────────────────────────
        Route::prefix('kds')->middleware('auth:sanctum')->group(function () {
            Route::get('/orders',               [KdsOrderController::class, 'orders']);
            Route::post('/orders/{id}/start',   [KdsOrderController::class, 'start']);
            Route::post('/orders/{id}/complete',[KdsOrderController::class, 'complete']);
        });

        // ── Admin ──────────────────────────────────────────────────────────────
        Route::prefix('admin')->middleware('admin')->group(function () {
            // Stats
            Route::get('/stats',                     [AdminStatsController::class, 'stats']);
            Route::get('/stats/chart',               [AdminStatsController::class, 'chart']);

            // Users
            Route::get('/users',                     [AdminUserController::class, 'index']);
            Route::get('/users/{id}',                [AdminUserController::class, 'show']);
            Route::post('/users',                    [AdminUserController::class, 'createUser']);
            Route::put('/users/{id}',                [AdminUserController::class, 'update']);
            Route::post('/users/{id}/verify-email',  [AdminUserController::class, 'verifyEmail']);
            Route::post('/users/{id}/ban',           [AdminUserController::class, 'ban']);
            Route::post('/users/{id}/unban',         [AdminUserController::class, 'unban']);
            Route::post('/users/{id}/send-warning',  [AdminUserController::class, 'sendWarning']);

            // Client Reports (across all stores)
            Route::get('/reports',                   [AdminUserController::class, 'reportedClients']);
            Route::post('/reports/{id}/resolve',     [AdminUserController::class, 'resolveReport']);

            // Orders
            Route::get('/orders',                    [AdminOrderController::class, 'index']);
            Route::get('/orders/{id}',               [AdminOrderController::class, 'show']);
            Route::post('/orders/{id}/cancel',       [AdminOrderController::class, 'cancel']);
            Route::post('/orders/{id}/refund',       [AdminOrderController::class, 'refund']);

            // Payouts
            Route::get('/payouts',                   [AdminPayoutController::class, 'index']);
            Route::get('/payouts/stats',             [AdminPayoutController::class, 'stats']);
            Route::post('/payouts/{id}/approve',     [AdminPayoutController::class, 'approve']);
            Route::post('/payouts/{id}/reject',      [AdminPayoutController::class, 'reject']);
            Route::post('/payouts/{id}/mark-paid',   [AdminPayoutController::class, 'markPaid']);

            // Stores
            Route::get('/stores',                    [AdminStoreController::class, 'index']);
            Route::get('/stores/{id}',               [AdminStoreController::class, 'show']);
            Route::put('/stores/{id}',               [AdminStoreController::class, 'update']);
            Route::post('/stores/{id}/approve',      [AdminStoreController::class, 'approve']);
            Route::post('/stores/{id}/reject',       [AdminStoreController::class, 'reject']);
            Route::post('/stores/{id}/suspend',      [AdminStoreController::class, 'suspend']);
            Route::post('/stores/{id}/unsuspend',    [AdminStoreController::class, 'unsuspend']);
            Route::post('/stores/{id}/toggle-ordering', [AdminStoreController::class, 'toggleOrdering']);
            Route::post('/stores/{storeId}/badges/{badgeId}', [AdminStoreController::class, 'assignBadge']);
            Route::delete('/stores/{storeId}/badges/{badgeId}', [AdminStoreController::class, 'removeBadge']);

            // Categories
            Route::get('/categories',                [AdminCategoryController::class, 'index']);
            Route::post('/categories',               [AdminCategoryController::class, 'store']);
            Route::put('/categories/{id}',           [AdminCategoryController::class, 'update']);
            Route::delete('/categories/{id}',        [AdminCategoryController::class, 'destroy']);

            // Badges
            Route::get('/badges',                    [AdminBadgeController::class, 'index']);
            Route::post('/badges',                   [AdminBadgeController::class, 'store']);
            Route::put('/badges/{id}',               [AdminBadgeController::class, 'update']);
            Route::delete('/badges/{id}',            [AdminBadgeController::class, 'destroy']);

            // Store Types
            Route::get('/store-types',                [AdminStoreTypeController::class, 'index']);
            Route::post('/store-types',               [AdminStoreTypeController::class, 'store']);
            Route::put('/store-types/{id}',           [AdminStoreTypeController::class, 'update']);
            Route::delete('/store-types/{id}',        [AdminStoreTypeController::class, 'destroy']);

            // Chefs
            Route::get('/chefs',                     [AdminChefController::class, 'index']);
            Route::get('/chefs/{id}',                [AdminChefController::class, 'show']);
            Route::post('/chefs/{id}/approve',       [AdminChefController::class, 'approve']);
            Route::post('/chefs/{id}/reject',        [AdminChefController::class, 'reject']);
            Route::delete('/chefs/{id}',             [AdminChefController::class, 'destroy']);

            // Reviews
            Route::get('/reviews',                   [AdminReviewController::class, 'index']);
            Route::delete('/reviews/{id}',           [AdminReviewController::class, 'destroy']);
            Route::get('/reviews/flags',             [AdminReviewController::class, 'flaggedReviews']);
            Route::post('/reviews/flags/{id}/dismiss', [AdminReviewController::class, 'dismissFlag']);
            Route::delete('/reviews/flags/{id}',     [AdminReviewController::class, 'deleteFlaggedReview']);
            Route::post('/reviews/{id}/reply',       [AdminReviewController::class, 'reply']);

            // Complaints
            Route::get('/complaints',                [AdminComplaintController::class, 'index']);
            Route::get('/complaints/{id}',           [AdminComplaintController::class, 'show']);
            Route::post('/complaints/{id}/reply',    [AdminComplaintController::class, 'reply']);
            Route::post('/complaints/{id}/categorize', [AdminComplaintController::class, 'categorize']);
            Route::post('/complaints/{id}/resolve',  [AdminComplaintController::class, 'resolve']);
            Route::post('/complaints/{id}/reopen',   [AdminComplaintController::class, 'reopen']);

            // Foods
            Route::get('/foods',                     [AdminFoodController::class, 'index']);
            Route::get('/foods/{id}',                [AdminFoodController::class, 'show']);
            Route::put('/foods/{id}',                [AdminFoodController::class, 'update']);
            Route::delete('/foods/{id}',             [AdminFoodController::class, 'destroy']);

            // Domains
            Route::get('/domains',                   [AdminDomainController::class, 'index']);

            // Reservations
            Route::get('/reservations',              [AdminReservationController::class, 'index']);
            Route::get('/reservations/{id}',         [AdminReservationController::class, 'show']);
            Route::post('/reservations/{id}/cancel', [AdminReservationController::class, 'cancel']);

            // Promo Codes
            Route::get('/promo-codes',               [AdminPromoCodeController::class, 'index']);
            Route::post('/promo-codes',              [AdminPromoCodeController::class, 'store']);
            Route::get('/promo-codes/{id}',          [AdminPromoCodeController::class, 'show']);
            Route::put('/promo-codes/{id}',          [AdminPromoCodeController::class, 'update']);
            Route::delete('/promo-codes/{id}',       [AdminPromoCodeController::class, 'destroy']);

            // Banners
            Route::get('/banners',                   [AdminBannerController::class, 'index']);
            Route::post('/banners',                  [AdminBannerController::class, 'store']);
            Route::get('/banners/{id}',              [AdminBannerController::class, 'show']);
            Route::put('/banners/{id}',              [AdminBannerController::class, 'update']);
            Route::delete('/banners/{id}',           [AdminBannerController::class, 'destroy']);

            // Templates
            Route::get('/templates',                     [AdminTemplateController::class, 'index']);
            Route::post('/templates',                    [AdminTemplateController::class, 'store']);
            Route::get('/templates/{template}',          [AdminTemplateController::class, 'show']);
            Route::put('/templates/{template}',          [AdminTemplateController::class, 'update']);
            Route::delete('/templates/{template}',       [AdminTemplateController::class, 'destroy']);

            // Template Blocks
            Route::get('/templates/{template}/blocks',           [AdminTemplateBlockController::class, 'index']);
            Route::post('/templates/{template}/blocks',          [AdminTemplateBlockController::class, 'store']);
            Route::get('/blocks/{templateBlock}',                [AdminTemplateBlockController::class, 'show']);
            Route::put('/blocks/{templateBlock}',                [AdminTemplateBlockController::class, 'update']);
            Route::delete('/blocks/{templateBlock}',             [AdminTemplateBlockController::class, 'destroy']);
            Route::post('/templates/{template}/blocks/reorder',  [AdminTemplateBlockController::class, 'reorder']);

            // Theme Presets
            Route::get('/templates/{template}/theme-presets',     [AdminThemePresetController::class, 'index']);
            Route::post('/templates/{template}/theme-presets',    [AdminThemePresetController::class, 'store']);
            Route::get('/theme-presets/{themePreset}',            [AdminThemePresetController::class, 'show']);
            Route::put('/theme-presets/{themePreset}',            [AdminThemePresetController::class, 'update']);
            Route::delete('/theme-presets/{themePreset}',         [AdminThemePresetController::class, 'destroy']);
            Route::post('/theme-presets/{themePreset}/set-default', [AdminThemePresetController::class, 'setDefault']);

            // Settings
            Route::get('/settings',                  [AdminSettingsController::class, 'index']);
            Route::put('/settings',                  [AdminSettingsController::class, 'update']);
            Route::post('/cache/clear',              [AdminSettingsController::class, 'clearCache']);

            // ── Admin: Plans ──
            Route::get('/plans',                               [AdminPlanController::class, 'index']);
            Route::post('/plans',                              [AdminPlanController::class, 'store']);
            Route::get('/plans/{plan}',                        [AdminPlanController::class, 'show']);
            Route::put('/plans/{plan}',                        [AdminPlanController::class, 'update']);
            Route::delete('/plans/{plan}',                     [AdminPlanController::class, 'destroy']);

            // ── Admin: Plan Features ──
            Route::get('/plan-features',                       [AdminPlanFeatureController::class, 'index']);
            Route::post('/plan-features',                      [AdminPlanFeatureController::class, 'store']);
            Route::put('/plan-features/{planFeature}',          [AdminPlanFeatureController::class, 'update']);
            Route::delete('/plan-features/{planFeature}',       [AdminPlanFeatureController::class, 'destroy']);

            // ── Admin: Plan Tiers ──
            Route::get('/plans/{plan}/tiers',                  [AdminPlanTierController::class, 'index']);
            Route::post('/plans/{plan}/tiers',                 [AdminPlanTierController::class, 'store']);
            Route::get('/tiers/{planTier}',                    [AdminPlanTierController::class, 'show']);
            Route::put('/tiers/{planTier}',                    [AdminPlanTierController::class, 'update']);
            Route::delete('/tiers/{planTier}',                 [AdminPlanTierController::class, 'destroy']);

            // ── Admin: Duration Offers ──
            Route::get('/tiers/{planTier}/duration-offers',     [AdminDurationOfferController::class, 'index']);
            Route::post('/tiers/{planTier}/duration-offers',    [AdminDurationOfferController::class, 'store']);
            Route::get('/duration-offers/{planDurationOffer}',  [AdminDurationOfferController::class, 'show']);
            Route::put('/duration-offers/{planDurationOffer}',  [AdminDurationOfferController::class, 'update']);
            Route::delete('/duration-offers/{planDurationOffer}',[AdminDurationOfferController::class, 'destroy']);

            // ── Admin: Delivery Pricing ──
            Route::get('/delivery-pricing/settings',            [AdminDeliveryPricingController::class, 'settings']);
            Route::put('/delivery-pricing/settings',            [AdminDeliveryPricingController::class, 'updateSettings']);
            Route::get('/delivery-pricing/tiers',               [AdminDeliveryPricingController::class, 'tiers']);
            Route::post('/delivery-pricing/tiers',              [AdminDeliveryPricingController::class, 'storeTier']);
            Route::put('/delivery-pricing/tiers/{deliveryPricingTier}', [AdminDeliveryPricingController::class, 'updateTier']);
            Route::delete('/delivery-pricing/tiers/{deliveryPricingTier}', [AdminDeliveryPricingController::class, 'deleteTier']);

            // ── Admin: Payment Gateways ──
            Route::get('/payment-gateways',                    [AdminPaymentGatewayController::class, 'index']);
            Route::post('/payment-gateways',                   [AdminPaymentGatewayController::class, 'store']);
            Route::get('/payment-gateways/{paymentGateway}',   [AdminPaymentGatewayController::class, 'show']);
            Route::put('/payment-gateways/{paymentGateway}',   [AdminPaymentGatewayController::class, 'update']);
            Route::delete('/payment-gateways/{paymentGateway}',[AdminPaymentGatewayController::class, 'destroy']);

            // ── Admin: Billing ──
            Route::get('/billing',                             [AdminBillingController::class, 'index']);
            Route::get('/billing/stats',                       [AdminBillingController::class, 'stats']);
            Route::post('/billing/invoices/{billingInvoice}/mark-paid', [AdminBillingController::class, 'markAsPaid']);
        });
    });
});

// ── Broadcasting Auth (Sanctum token) ─────────────────────────────────────
Route::post('/broadcasting/auth', \App\Http\Controllers\Api\BroadcastAuthController::class)
    ->middleware('auth:sanctum');

// ============================================================================
// Legacy compatibility — redirect /api/* to /api/v1/* (mobile apps may cache old URLs)
// ============================================================================
Route::redirect('/categories', '/api/v1/categories', 308);
Route::redirect('/stores', '/api/v1/stores', 308);
Route::redirect('/search', '/api/v1/search', 308);