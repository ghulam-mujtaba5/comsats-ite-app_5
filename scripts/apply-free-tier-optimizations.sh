#!/bin/bash

# Script to apply free tier optimizations to the database
# This script applies the index optimization migrations to improve query performance

echo -e "\033[0;32mApplying free tier database optimizations...\033[0m"

# Check if Supabase CLI is installed
if ! command -v npx &> /dev/null
then
    echo -e "\033[0;31mError: npx is not installed. Please install Node.js and npm.\033[0m"
    exit 1
fi

# Check if Supabase project is linked
if ! npx supabase link --check &> /dev/null
then
    echo -e "\033[0;31mError: Supabase project is not linked. Please run 'npx supabase link' first.\033[0m"
    exit 1
fi

# Apply the optimization migrations
echo -e "\033[1;33mApplying faculty indexes optimization...\033[0m"
npx supabase migration up 20251010010000

echo -e "\033[1;33mApplying reviews indexes optimization...\033[0m"
npx supabase migration up 20251010020000

echo -e "\033[1;33mApplying community posts indexes optimization...\033[0m"
npx supabase migration up 20251010030000

echo -e "\033[1;33mApplying post reactions indexes optimization...\033[0m"
npx supabase migration up 20251010040000

echo -e "\033[0;32mDatabase optimizations applied successfully!\033[0m"
echo -e "\033[0;32mYour application is now optimized for the Vercel free tier.\033[0m"