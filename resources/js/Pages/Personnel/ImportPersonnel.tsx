import Papa from 'papaparse';
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, Import, Loader, LucideIcon, User, XCircle } from 'lucide-react';
import { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { PageProps, Personnel, Section } from '@/types';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import toast from '@/components/toast';
import axios from 'axios';
import generateRandomPassword from '@/lib/generateRandomPassword';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import NewPersonnel from './NewPersonnel';
import { getOrdinalSuffix } from '@/lib/utils';


interface NewPersonnel {
  first_name: string,
  middle_name?: string,
  surname: string,
  name_extension?: string,
  email: string,
  mobile_number?: string,
  roles: string[],
  sections: number[],
  password?: string,
};

type Errors<T> = {
  [Property in keyof T]: string | undefined;
};

export default function ImportPersonnel({ roles, sections }: PageProps<{
  roles: {[key: string]: string},
  sections: {[key: number]: string},
}>) {
  const [csvFile, setCSVFile] = useState<File>();
  const [personnelList, setPersonnelList] = useState<NewPersonnel[]>([]);
  const [passwordsGenerated, setPasswordsGenerated] = useState(false);

  const handleFileSubmit: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    setCSVFile(e.target.files[0]);

    let list: NewPersonnel[] = [];

    Papa.parse<{
      first_name: string,
      middle_name: string,
      surname: string,
      name_extension: string,
      email_address: string,
      mobile_number: string,
      roles: string,
      sections: string,
    }>(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      step: (results) => {
        if(results.errors.length > 0) {
          toast('error', 'Import Error', `"${results.errors[0].message}" on Row ${results.errors[0].row}`);
        };
        list.push({
          first_name: results.data.first_name,
          middle_name: results.data.middle_name || undefined,
          surname: results.data.surname,
          name_extension: results.data.name_extension || undefined,
          email: results.data.email_address,
          mobile_number: results.data.mobile_number || undefined,
          roles: results.data.roles.split(','),
          sections: results.data.sections.split(',').map(section => +section),
        });
      },
      complete: () => {
        setPersonnelList(list)
        setPasswordsGenerated(false);
      },
    });
  }

  const handleImport: MouseEventHandler = (e) => {
    e.preventDefault();

    axios.post('/personnel/import', {
      personnel: personnelList,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        const {message} = err.response.data;
        
        toast('error', 'Import Error', replaceErrorMessage(message));

      });
  }
  
  const replaceErrorMessage = (msg: string) => {
    return msg.replace(/personnel\.(?<index>\d+)\.(?<field>[A-Za-z\-_]+)/, (_: string, index: string, field: string, ) => `${getOrdinalSuffix(parseInt(index) + 1)} entry's '${field}'`)
  }

  const handleGeneratePasswords: MouseEventHandler = (e) => {
    e.preventDefault();

    setPersonnelList(personnelList.map((personnel) => {
      return {
        ...personnel,
        password: generateRandomPassword(),
      };
    }));

    setPasswordsGenerated(true);
  }
  

  const columns: ColumnDef<NewPersonnel>[] = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'middle_name',
      header: 'Middle Name',
    },
    {
      accessorKey: 'surname',
      header: 'Surname',
    },
    {
      accessorKey: 'name_extension',
      header: 'Extension',
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
    },
    {
      accessorKey: 'mobile_number',
      header: 'Mobile Number',
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          {row.getValue<string[]>('roles').map((role) => (
            <span key={role}>{roles[role]}</span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'sections',
      header: 'Sections',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          {row.getValue<number[]>('sections').map((section) => (
            <span key={section}>{sections[section]}</span>
          ))}
        </div>
      )
    },
    {
      accessorKey: 'password',
      header: 'Generated Password',
      cell: ({ row }) => {
        if (row.getValue<string>('password')) {
          return (
            <span>{row.getValue<string>('password')}</span>
          );
        } else {
          return (
            <div className='flex flex-col justify-center items-center'>
              <Tooltip>
                <TooltipTrigger>
                  <XCircle className='w-4 h-4' />
                </TooltipTrigger>
                <TooltipContent>No password generated</TooltipContent>
              </Tooltip>
            </div>
          )
        }
      },
    }
  ]

  return (
    <div className='px-6 py-6 bg-gray-50 min-h-screen'>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
          <Link href="/personnel">
            <ArrowLeft className="w-4 h-4" />
            Back to Personnel List
          </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import Personnel</h1>
            <p className="text-gray-600">Import Personnel from a CSV File</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center gap-2">
            <Import className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Import File</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">A Comma-separated Values (CSV) file containing Personnel Details</p>
        </div>

        <div className="p-6">
          <div className='grid grid-cols-1 lg:grid-cols-6 gap-6'>
            <div className='lg:col-span-3'>
              <div className='space-y-3'>
                <label htmlFor='file' className="flex flex-col items-center cursor-pointer">
                  <div className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <Import className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Upload File</p>
                      <p className="text-xs text-gray-400">Click to browse</p>
                    </div>
                  </div>
                </label>
                <input
                  type='file'
                  id='file'
                  name='file'
                  accept='text/csv'
                  onChange={handleFileSubmit}
                  hidden
                />
              </div>
            </div>

            {csvFile && (
              <div className='lg:col-span-3'>
                <div className='space-y-3'>
                  <div className='flex flex-col justify-between h-40'>
                    <div className='grid grid-cols-2 gap-2'>
                      <span className='font-bold'>Name: </span>
                      <p>{csvFile.name}</p>

                      <span className='font-bold'>Number of Entries:</span>
                      <p>{personnelList.length}</p>

                    </div>
                    <Button disabled={passwordsGenerated} onClick={handleGeneratePasswords}>Generate Random Passwords</Button>
                    <Button disabled={!passwordsGenerated} onClick={handleImport}>Import</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {personnelList.length >= 1 && (

        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personnel List</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Details of Personnel that will be imported</p>
          </div>

          <DataTable 
            columns={columns}
            data={personnelList}
          />
        </div>
      )}

    </div>
  );
}

ImportPersonnel.layout = (e: JSX.Element) => <Authenticated pageTitle="Personnel Import (CSV)" children={e} />