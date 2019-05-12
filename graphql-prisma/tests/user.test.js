import { getFirstName, isValidPassword } from '../src/utils/user'

test('should return first name when given full name', () => {
  const firstName = getFirstName('Ryan Magoon')
  expect(firstName).toBe('Ryan')
})

test('should return first name when given first name', () => {
  const firstName = getFirstName('Ryan')
  expect(firstName).toBe('Ryan')
})

test('should reject password shorter than 8 characters', () => {
  const result = isValidPassword('asdf')
  expect(result).toBe(false)
})

test('should reject password that contains the word "password"', () => {
  const result = isValidPassword('xxpassword123xx')
  expect(result).toBe(false)
})

test('should validate a valid password', () => {
  const result = isValidPassword('asdf1234')
  expect(result).toBe(true)
})
