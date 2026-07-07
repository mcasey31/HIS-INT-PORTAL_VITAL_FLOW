#r "nuget: Microsoft.AspNetCore.Cryptography.KeyDerivation, 8.0.0"

using System;
using System.Security.Cryptography;
using System.Text;

const int SaltSize = 16;
const int HashSize = 32;
const int iterations = 100000;
const string Prefix = "pbkdf2-sha256";

var password = args.Length > 0 ? args[0] : "123456";

var salt = new byte[SaltSize];
using var rng = RandomNumberGenerator.Create();
rng.GetBytes(salt);

var hash = Rfc2898DeriveBytes.Pbkdf2(
    Encoding.UTF8.GetBytes(password),
    salt,
    iterations,
    HashAlgorithmName.SHA256,
    HashSize);

var result = $"{Prefix}${iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
Console.WriteLine(result);
