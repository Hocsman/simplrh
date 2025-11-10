-- Storage Bucket Policies for SimplRH
-- Exécuter après avoir créé le bucket "documents" dans Supabase Storage

-- Politique 1 : Les utilisateurs authentifiés peuvent uploader dans leur dossier org
CREATE POLICY "Users can upload to their org folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 2 : Les utilisateurs peuvent lire les fichiers de leur org
CREATE POLICY "Users can read their org files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 3 : Les utilisateurs peuvent supprimer les fichiers de leur org
CREATE POLICY "Users can delete their org files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);

-- Politique 4 : Les utilisateurs peuvent mettre à jour les fichiers de leur org
CREATE POLICY "Users can update their org files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] IN (
    SELECT org_id::text 
    FROM members 
    WHERE user_id = auth.uid()
  )
);





