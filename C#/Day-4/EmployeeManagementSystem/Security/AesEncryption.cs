using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace EmployeeManagementSystem.Security;

public class AesEncryption
{
    public static string Encrypt(string plainText, string key)
    {
        using Aes aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(key);
        aes.GenerateIV();
        using ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using MemoryStream ms = new();
        ms.Write(aes.IV, 0, aes.IV.Length);
        using CryptoStream cs = new(ms, encryptor, CryptoStreamMode.Write);
        using StreamWriter sw = new(cs);
        sw.Write(plainText);
        sw.Flush();
        cs.FlushFinalBlock();
        return Convert.ToBase64String(ms.ToArray());
    }

    public static string Decrypt(string cipherText, string key)
    {
        byte[] fullCipher = Convert.FromBase64String(cipherText);
        using Aes aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(key);
        byte[] iv = new byte[aes.BlockSize / 8];
        Array.Copy(fullCipher, 0, iv, 0, iv.Length);
        aes.IV = iv;
        using ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using MemoryStream ms = new MemoryStream(fullCipher, iv.Length, fullCipher.Length - iv.Length);
        using CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using StreamReader sr = new StreamReader(cs);
        return sr.ReadToEnd();
    }
}
