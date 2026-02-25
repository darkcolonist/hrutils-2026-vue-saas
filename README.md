<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About
- PHP 8.1.4
- Node 18.12.0
- Laravel 10x
- Breeze
- InertiaJS
- React
- MUI

## Features
- infinite scrolling in gallery
- simplified datagrid and table components
- hybrid implementation for tailwindcss and react-material-ui (MUI)
- privacy screen when viewing confidential information
- non-administrative pages (crud) are mobile ready
- dynamic role management and simplistic permission to role assignment
- background check
- attendance check
- big calendar implementation for leaves and birthdays
- my department view for current employees status
- cache implementation but with experimentation on other caching strategies (a bit messy) but the finality was Laravel's Cache Facade was sufficient
- cache closure warm-up
- quicksearch overriding the `/` key

## Installation
- ```copy .env.example .env```
- ```touch database/database.sqlite```
- ```php artisan migrate:fresh --seed```
- login using `admin@example.com` with password `admin`

## Background
- ```php artisan queue:listen```
- ```php artisan schedule:work```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
