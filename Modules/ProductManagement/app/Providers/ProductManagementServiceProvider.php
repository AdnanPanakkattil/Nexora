<?php

namespace Modules\ProductManagement\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;
// use Illuminate\Console\Scheduling\Schedule;
use Modules\ProductManagement\Providers\EventServiceProvider;
use Modules\ProductManagement\Providers\RouteServiceProvider;

class ProductManagementServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'ProductManagement';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'productmanagement';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    // protected array $commands = [];

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    /**
     * Define module schedules.
     *
     * @param $schedule
     */
    // protected function configureSchedules(Schedule $schedule): void
    // {
    //     $schedule->command('inspire')->hourly();
    // }
}
