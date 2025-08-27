<?php

namespace App\Facades;

use App\Services\GeoapifyService;
use Illuminate\Support\Facades\Facade;

class Geoapify extends Facade
{
  protected static function getFacadeAccessor()
  {
    return GeoapifyService::class;
  }
}